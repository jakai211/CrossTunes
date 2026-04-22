import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const username = `${firstName} ${lastName}`;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
      [email, username, hashed]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
