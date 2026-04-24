import express from "express";
import bcrypt from "bcrypt";
import { createUser } from "../db/users.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Keep basic sanitization for profile fields, but allow strong password symbols.
  const forbiddenProfileChars = /[<>\\/='"]/;
  if (forbiddenProfileChars.test(firstName) || forbiddenProfileChars.test(lastName)) {
    return res.status(400).json({ error: "Invalid characters in name fields." });
  }

  const normalizedEmail = String(email).trim();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }

  if (!/[!@#$%^&*(),.?\":{}|<>[\]\\/~`_\-+=;]/.test(String(password))) {
    return res.status(400).json({ error: "Password must include at least one special character" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await createUser({
      email: normalizedEmail,
      firstName,
      lastName,
      password: hashed,
    });

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
