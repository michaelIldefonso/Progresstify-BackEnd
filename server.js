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
const workspaceRoutes = require("./src/mainApp/routes/workspaceRoutes");
const boardRoutes = require("./src/mainApp/routes/boardRoutes");
const columnRoutes = require("./src/mainApp/routes/columnRoutes"); // Import column routes
const cardRoutes = require("./src/mainApp/routes/cardRoutes");
const updateLastActive = require("./src/middleware/updateLastActiveMiddleware"); // Import middleware

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
        allowedHeaders: ["Authorization", "Content-Type"],
    })
);

app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes); // Use column routes
app.use("/api/cards", cardRoutes); // Use card routes

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

app.get("/api/users", ensureAuthenticated, updateLastActive, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT users.id, users.email, users.role_id
             FROM users
             LEFT JOIN roles ON users.role_id = roles.id` // Join roles table to fetch role_id
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/data", ensureAuthenticated, updateLastActive, (req, res) => {
    res.json({
        message: "This is some data from the API",
        userId: req.user.id,
        userEmail: req.user.email,
        userName: req.user.name,
        userOauth_id: req.user.oauth_id,
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
