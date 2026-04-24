import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import musicRoute from "./routes/music.js";
import spotifyAuthRoute from "./routes/spotifyAuth.js";

dotenv.config();

const app = express();
const port = Number.parseInt(process.env.PORT || "3000", 10);

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
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
