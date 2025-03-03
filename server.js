require("dotenv").config();
const express = require("express");
const passport = require("./src/config/auth");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cors = require("cors");
const ensureAuthenticated = require("./src/middleware/authMiddleware");
const path = require("path");
const jwt = require("jsonwebtoken");
const pool = require("./src/config/db"); // Import database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Automatically set frontend URL (from `.env`)
const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"]
    })
);

app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
