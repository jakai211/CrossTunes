import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.json({ message: "Login successful", userId: user.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
