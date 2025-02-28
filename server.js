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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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
  res.json({ message: `Hello, ${req.user.name}!` });
});

// Fetch User Data
app.get("/api/users", ensureAuthenticated, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role_id FROM users WHERE email = $1",
            [req.user.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]); // Send user data
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: err.message });
    }
});

// Google OAuth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        console.log("✅ Login Success! Redirecting...");
        // Generate JWT token
        const token = req.user.generateJwt();
        res.redirect(`/dashboard?token=${token}`);
    }
);

app.get("/login", (req, res) => {
    res.render("login"); // Render the login.ejs file
});

app.get("/dashboard", (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.redirect("/login"); // Redirect to login if no token is provided
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.render("dashboard", { user }); // Render the dashboard.ejs file with user data
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));