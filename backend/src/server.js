require("dotenv").config();

const express = require("express");

const cors = require("cors");



const authRoutes = require("./routes/auth");

const spotifyRoutes = require("./routes/spotify");



const app = express();

app.use(cors());

app.use(express.json());



app.use("/auth/spotify", authRoutes);

app.use("/spotify", spotifyRoutes);



app.listen(3000, () => console.log("Backend running on port 3000"));


