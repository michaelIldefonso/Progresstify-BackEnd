require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

// Config imports
const passport = require("./src/config/googleAuth"); // Google Auth
const jwt = require("jsonwebtoken"); // Add this line
const pool = require("./src/config/db"); // Add this line
require("./src/config/githubAuth"); // GitHub Auth (initialize)

// Middleware imports
const ensureAuthenticated = require("./src/middleware/authMiddleware");
const updateLastActive = require("./src/middleware/updateLastActiveMiddleware");

// Route imports - MainApp
const workspaceRoutes = require("./src/mainApp/routes/workspaceRoutes");
const boardRoutes = require("./src/mainApp/routes/boardRoutes");
const columnRoutes = require("./src/mainApp/routes/columnRoutes");
const cardRoutes = require("./src/mainApp/routes/cardRoutes");

// Route imports - AdminApp
const adminRoutes = require("./src/adminApp/routes/userManagement");
const dashboardRoutes = require("./src/adminApp/routes/dashboardRoutes");

// Route imports - General
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminAuthRoutes = require("./src/routes/adminAuthRoutes"); // Add this line
const refreshTokenRoutes = require("./src/routes/refreshTokenRoutes"); // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Automatically set frontend URL (from `.env`)
const CLIENT_URL = process.env.CLIENT_URL;
const ADMIN_URL = process.env.ADMIN_URL;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(
    cors({
        origin: [CLIENT_URL, ADMIN_URL], // Wrap multiple origins in an array
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
    })
);

app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/auth/admin", adminAuthRoutes); // Add this line
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/token", refreshTokenRoutes); // Add this line

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

app.get("/api/data", ensureAuthenticated, updateLastActive, (req, res) => {
    res.json({
        message: "This is some data from the API",
        userId: req.user.id,
        userEmail: req.user.email,
        userName: req.user.name,
        userOauth_id: req.user.oauth_id,
        userRole: req.user.role_id,
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
