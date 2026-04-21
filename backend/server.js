import express from "express";
import dotenv from "dotenv";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);

// Test route for networking
app.get("/test", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
