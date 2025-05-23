require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");

// Config imports
require("./src/config/googleAuth"); // Initializes Google authentication strategy
require("./src/config/githubAuth"); // Initializes GitHub authentication strategy

// Route imports - MainApp
const workspaceRoutes = require("./src/mainApp/routes/workspaceRoutes");
const boardRoutes = require("./src/mainApp/routes/boardRoutes");
const columnRoutes = require("./src/mainApp/routes/columnRoutes");
const cardRoutes = require("./src/mainApp/routes/cardRoutes");
const mainAppMaintenanceRoutes = require("./src/mainApp/routes/maintenanceRoutes");

// Route imports - AdminApp
const adminRoutes = require("./src/adminApp/routes/userManagement");
const dashboardRoutes = require("./src/adminApp/routes/dashboardRoutes");
const maintenanceRoutes = require("./src/adminApp/routes/maintenanceRoutes");

// Route imports - Authentication and tokens
const authRoutes = require("./src/routes/authRoutes");
const adminAuthRoutes = require("./src/routes/adminAuthRoutes");
const refreshTokenRoutes = require("./src/routes/refreshTokenRoutes"); 

// Route imports - Data
// This route is used to fetch data from the database for the frontend
const dataRoutes = require("./src/routes/dataRoutes");

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

// Auth Routes
app.use("/auth", authRoutes);
app.use("/auth/admin", adminAuthRoutes);
app.use("/token", refreshTokenRoutes);


// mainApp Routes
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);

//mainApp Maintenance Routes
app.use("/api/maintenance", mainAppMaintenanceRoutes);

// adminApp Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/maintenance", maintenanceRoutes);

// data Route
app.use("/api/data", dataRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
