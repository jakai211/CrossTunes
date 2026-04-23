import crypto from "crypto";
import express from "express";
import dotenv from "dotenv";
import { getSpotifyConnectionStatus, upsertSpotifyToken } from "../db/oauthTokens.js";

dotenv.config();

const router = express.Router();
const stateStore = new Map();

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID || process.env.CLIENT_ID || "";
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || process.env.CLIENT_SECRET || "";
const spotifyRedirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:3000/auth/spotify/callback";
const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const spotifyScopes = [
  "user-read-email",
  "user-read-private",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(" ");

function parseUserId(value) {
  const userId = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

function consumeState(state) {
  const payload = stateStore.get(state);
  if (!payload) return null;
  stateStore.delete(state);

  if (Date.now() - payload.createdAt > 10 * 60 * 1000) {
    return null;
  }

  return payload;
}

function createFrontendRedirect(pathAndHash) {
  return `${frontendBaseUrl.replace(/\/$/, "")}/${pathAndHash.replace(/^\//, "")}`;
}

router.get("/spotify/start", (req, res) => {
  const userId = parseUserId(req.query.userId);
  if (!userId) {
    return res.status(400).json({ error: "Valid userId is required" });
  }

  if (!spotifyClientId || !spotifyClientSecret) {
    return res.status(500).json({ error: "Spotify OAuth credentials are not configured" });
  }

  const state = crypto.randomBytes(16).toString("hex");
  stateStore.set(state, { userId, createdAt: Date.now() });

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", spotifyClientId);
  authUrl.searchParams.set("scope", spotifyScopes);
  authUrl.searchParams.set("redirect_uri", spotifyRedirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("show_dialog", "true");

  return res.redirect(authUrl.toString());
});

router.get("/spotify/callback", async (req, res) => {
  const code = String(req.query.code || "");
  const state = String(req.query.state || "");
  const oauthError = String(req.query.error || "");

  if (oauthError) {
    return res.redirect(createFrontendRedirect(`#/playlists?spotify=error&reason=${encodeURIComponent(oauthError)}`));
  }

  const statePayload = consumeState(state);
  if (!statePayload || !code) {
    return res.redirect(createFrontendRedirect("#/playlists?spotify=error&reason=invalid_state"));
  }

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: spotifyRedirectUri,
      }),
    });

    const tokenPayload = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenPayload.access_token) {
      return res.redirect(createFrontendRedirect("#/playlists?spotify=error&reason=token_exchange_failed"));
    }

    const expiresIn = Number.parseInt(String(tokenPayload.expires_in || "3600"), 10);
    const expiresAt = new Date(Date.now() + Math.max(expiresIn, 60) * 1000);

    await upsertSpotifyToken({
      userId: statePayload.userId,
      accessToken: tokenPayload.access_token,
      refreshToken: tokenPayload.refresh_token || null,
      tokenType: tokenPayload.token_type || null,
      scope: tokenPayload.scope || null,
      expiresAt,
    });

    return res.redirect(createFrontendRedirect("#/playlists?spotify=connected"));
  } catch (err) {
    console.error("Spotify callback failed:", err);
    return res.redirect(createFrontendRedirect("#/playlists?spotify=error&reason=server_error"));
  }
});

router.get("/spotify/status", async (req, res) => {
  const userId = parseUserId(req.query.userId);
  if (!userId) {
    return res.status(400).json({ error: "Valid userId is required" });
  }

  try {
    const status = await getSpotifyConnectionStatus(userId);
    return res.json(status);
  } catch (err) {
    console.error("Spotify status failed:", err);
    return res.status(500).json({ error: "Failed to fetch Spotify status" });
  }
});

export default router;
