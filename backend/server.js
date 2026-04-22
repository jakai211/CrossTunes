import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
