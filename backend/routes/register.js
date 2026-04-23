import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/pool.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Check for forbidden characters
  const forbiddenChars = /[<>\ /=\\'"]/;
  if (forbiddenChars.test(email) || forbiddenChars.test(firstName) || forbiddenChars.test(lastName) || forbiddenChars.test(password)) {
    return res.status(400).json({ error: "Invalid characters in input. Characters < > / = ' \" \\ are not allowed." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)",
      [email, firstName, lastName, hashed]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    if (err.code === "ECONNREFUSED" || err.code === "PROTOCOL_CONNECTION_LOST") {
      return res.status(503).json({ error: "Database unavailable. Start MySQL and try again." });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
