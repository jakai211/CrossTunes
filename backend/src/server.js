const express = require("express");
const cors = require("cors");
require("dotenv").config();

const registerHandler = require("./auth/register");
const loginHandler = require("./auth/login");
const meHandler = require("./auth/me");
const logoutHandler = require("./auth/logout");
const { authMiddleware } = require("./auth/jwt");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/auth/register", registerHandler);
app.post("/auth/login", loginHandler);
app.get("/auth/me", authMiddleware, meHandler);
app.post("/auth/logout", authMiddleware, logoutHandler);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
