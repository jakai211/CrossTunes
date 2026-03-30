const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db/pool");
require("dotenv").config();

router.get("/login", (req, res) => {
  const scopes = [
    "user-read-recently-played",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-top-read"
  ].join(" ");

  const redirect =
    "https://accounts.spotify.com/authorize" +
    `?client_id=${process.env.CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  res.redirect(redirect);
});

router.get("/callback", async (req, res) => {
  const code = req.query.code;

  const tokenRes = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token, refresh_token, expires_in } = tokenRes.data;

  const profile = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const spotifyId = profile.data.id;

  await db.query(
    `INSERT INTO users (spotify_user_id) VALUES (?) 
     ON DUPLICATE KEY UPDATE spotify_user_id = spotify_user_id`,
    [spotifyId]
  );

  const [[user]] = await db.query(
    "SELECT id FROM users WHERE spotify_user_id = ?",
    [spotifyId]
  );

  await db.query(
    `REPLACE INTO tokens (user_id, access_token, refresh_token, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))`,
    [user.id, access_token, refresh_token, expires_in]
  );

  res.send("Spotify connected successfully");
});

module.exports = router;
