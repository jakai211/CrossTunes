const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db/pool");
const refreshToken = require("../utils/refreshToken");

router.get("/recent", async (req, res) => {
  const userId = req.query.user_id;

  const [[tokenRow]] = await db.query(
    "SELECT * FROM tokens WHERE user_id = ?",
    [userId]
  );

  const token = await refreshToken(tokenRow);

  const data = await axios.get(
    "https://api.spotify.com/v1/me/player/recently-played",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  res.json(data.data);
});

module.exports = router;
