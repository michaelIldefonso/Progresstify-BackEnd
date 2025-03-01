require("dotenv").config();
const express = require("express");
const passport = require("./src/config/auth");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cors = require("cors");
const ensureAuthenticated = require("./src/middleware/authMiddleware");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// Automatically set frontend URL (from `.env`)
const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


// CORS Middleware (Allows requests from frontend)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

// Passport Middleware
app.use(passport.initialize());

// Authentication & User Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.render("index"); // Render the index.ejs file
});

// Protected API Route (Only accessible if authenticated)
app.get("/api/data", ensureAuthenticated, (req, res) => {
    console.log("Authenticated User:", req.user); // Log the authenticated user
    res.json({ message: `Hello, ${req.user.name}!` });
});

// Fetch All Users Data
app.get("/api/all-users", ensureAuthenticated, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role_id FROM users"
        );

        res.json(result.rows); // Send all user data
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
});

// Google OAuth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        try {
            console.log("✅ Login Success! Redirecting...");
            // Generate JWT token
            const token = req.user.generateJwt();
            console.log("Generated Token:", token); // Log the generated token
            res.redirect(`${CLIENT_URL}/dashboard?token=${token}`);
        } catch (err) {
            console.error("Error during Google OAuth callback:", err);
            res.status(500).send("Internal Server Error");
        }
    }
);

app.get("/login", (req, res) => {
    res.render("login"); // Render the login.ejs file
});

app.get("/dashboard", (req, res) => {
    const token = req.query.token;
    console.log("Dashboard Token:", token); // Log the token

    if (!token) {
        return res.redirect("/login"); // Redirect to login if no token is provided
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified User:", user); // Log the verified user
        res.render("dashboard", { user }); // Render the dashboard.ejs file with user data
    } catch (err) {
        console.error("JWT Verification Error:", err); // Log the verification error
        res.redirect("/login");
    }
});

// Serve the dashboard HTML file
app.get("/static-dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));