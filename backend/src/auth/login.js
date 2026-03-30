const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const { signToken } = require("./jwt");

async function loginHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, email, password_hash, username FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = loginHandler;
