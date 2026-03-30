const axios = require("axios");
const db = require("../db/pool");

module.exports = async function refreshToken(row) {
  const now = new Date();
  const expires = new Date(row.expires_at);

  if (now < expires) return row.access_token;

  const tokenRes = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: row.refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token, expires_in } = tokenRes.data;

  await db.query(
    `UPDATE tokens SET access_token = ?, expires_at = DATE_ADD(NOW(), INTERVAL ? SECOND)
     WHERE user_id = ?`,
    [access_token, expires_in, row.user_id]
  );

  return access_token;
};
