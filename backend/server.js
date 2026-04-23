import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import musicRoute from "./routes/music.js";
import spotifyAuthRoute from "./routes/spotifyAuth.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/music", musicRoute);
app.use("/auth", spotifyAuthRoute);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
