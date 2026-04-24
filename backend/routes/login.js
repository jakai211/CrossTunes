import express from "express";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../db/users.js";
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

  // Check for forbidden characters in email and password
  const forbiddenChars = /[<>\\/='"\|\[\]{}~`]/;
  if (forbiddenChars.test(normalizedEmail) || forbiddenChars.test(String(password))) {
    return res.status(400).json({ error: "Invalid characters in input fields." });
  }

  try {
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
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
