const pool = require("../db/pool");

async function meHandler(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, username, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user: rows[0] });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = meHandler;
