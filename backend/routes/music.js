import express from "express";

const router = express.Router();

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID || process.env.CLIENT_ID || "";
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || process.env.CLIENT_SECRET || "";
const youtubeApiKey = process.env.YOUTUBE_API_KEY || "";
const soundcloudClientId = process.env.SOUNDCLOUD_CLIENT_ID || "";

let spotifyToken = null;
let spotifyTokenExpiresAt = 0;

function isValidQuery(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length < 2 || trimmed.length > 80) return false;
  return /^[a-zA-Z0-9\s.,'!&()-]+$/.test(trimmed);
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "-";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

async function getSpotifyToken() {
  if (spotifyToken && Date.now() < spotifyTokenExpiresAt) {
    return spotifyToken;
  }

  if (!spotifyClientId || !spotifyClientSecret) {
    throw new Error("Spotify credentials missing");
  }

  const credentials = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Spotify token request failed");
  }

  const payload = await response.json();
  spotifyToken = payload.access_token;
  spotifyTokenExpiresAt = Date.now() + Math.max((payload.expires_in || 3600) - 30, 60) * 1000;
  return spotifyToken;
}

async function searchSpotify(query, limit) {
  const token = await getSpotifyToken();
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Spotify search failed");
  }

  const data = await response.json();
  return (data.tracks?.items || []).map((item) => ({
    id: `spotify-${item.id}`,
    title: item.name || "Unknown title",
    artist: item.artists?.map((artist) => artist.name).join(", ") || "Unknown artist",
    album: item.album?.name || "Unknown album",
    duration: formatDuration(item.duration_ms),
    source: "Spotify",
    genre: "Music",
    previewUrl: item.preview_url || null,
    trackUrl: item.external_urls?.spotify || null,
  }));
}

async function searchYouTubeMusic(query, limit) {
  if (!youtubeApiKey) {
    throw new Error("YouTube API key missing");
  }

  const url =
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=${limit}` +
    `&q=${encodeURIComponent(query)}&key=${encodeURIComponent(youtubeApiKey)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("YouTube search failed");
  }

  const data = await response.json();
  return (data.items || []).map((item) => ({
    id: `youtube-${item.id?.videoId || Math.random().toString(36).slice(2)}`,
    title: item.snippet?.title || "Unknown title",
    artist: item.snippet?.channelTitle || "Unknown channel",
    album: "YouTube Music",
    duration: "-",
    source: "YouTube",
    genre: "Music",
    previewUrl: null,
    trackUrl: item.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : null,
  }));
}

async function searchSoundCloud(query, limit) {
  if (!soundcloudClientId) {
    throw new Error("SoundCloud client ID missing");
  }

  const url =
    `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&limit=${limit}` +
    `&client_id=${encodeURIComponent(soundcloudClientId)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("SoundCloud search failed");
  }

  const data = await response.json();
  return (data.collection || []).map((item) => ({
    id: `soundcloud-${item.id}`,
    title: item.title || "Unknown title",
    artist: item.user?.username || "Unknown artist",
    album: "SoundCloud",
    duration: formatDuration(item.duration),
    source: "SoundCloud",
    genre: item.genre || "Music",
    previewUrl: item.media?.transcodings?.[0]?.url || null,
    trackUrl: item.permalink_url || null,
  }));
}

router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const limitRaw = Number.parseInt(String(req.query.limit || "8"), 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 20) : 8;
  const sourcesParam = String(req.query.sources || "spotify,youtube,soundcloud");
  const requestedSources = new Set(
    sourcesParam
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );

  if (!isValidQuery(q)) {
    return res.status(400).json({
      error: "Invalid query. Use 2-80 letters/numbers and common punctuation only.",
    });
  }

  const songs = [];
  const unavailableSources = [];

  const tasks = [];

  if (requestedSources.has("spotify")) {
    tasks.push(
      searchSpotify(q, limit)
        .then((results) => songs.push(...results))
        .catch(() => unavailableSources.push("Spotify"))
    );
  }

  if (requestedSources.has("youtube")) {
    tasks.push(
      searchYouTubeMusic(q, limit)
        .then((results) => songs.push(...results))
        .catch(() => unavailableSources.push("YouTube"))
    );
  }

  if (requestedSources.has("soundcloud")) {
    tasks.push(
      searchSoundCloud(q, limit)
        .then((results) => songs.push(...results))
        .catch(() => unavailableSources.push("SoundCloud"))
    );
  }

  await Promise.all(tasks);

  if (songs.length === 0) {
    return res.status(502).json({
      error: "No providers responded successfully",
      unavailableSources,
    });
  }

  return res.json({ songs, unavailableSources });
});

export default router;
