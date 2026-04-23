import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/pool.js";
import Logger from "../logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const normalizedEmail = String(email).trim();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      Logger.logLogin(normalizedEmail, user.id, user.firstName || "", false);
      return res.status(400).json({ error: "Incorrect password" });
    }

    Logger.logLogin(normalizedEmail, user.id, user.firstName || "", true);
    res.json({
      message: "Login successful",
      userId: user.id,
      firstName: user.firstName || "",
    Logger.logError("Login error", err);
    });
  } catch (err) {
    console.log(err);

    if (err.code === "ECONNREFUSED" || err.code === "PROTOCOL_CONNECTION_LOST") {
      return res.status(503).json({ error: "Database unavailable. Start MySQL and try again." });
    }

    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
