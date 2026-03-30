const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const { signToken } = require("./jwt");

async function registerHandler(req, res) {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [existingEmail] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const [existingUsername] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existingUsername.length > 0) {
      return res.status(409).json({ error: "Username already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)",
      [email, passwordHash, username]
    );

    const user = { id: result.insertId, email, username };
    const token = signToken(user);

    return res.status(201).json({ user, token });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = registerHandler;
