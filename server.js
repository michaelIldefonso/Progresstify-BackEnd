require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./src/config/auth");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const pgSession = require('connect-pg-simple')(session);
const cors = require("cors");
const ensureAuthenticated = require("./src/middleware/authMiddleware");
const pool = require("./src/config/db");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Automatically set frontend URL (from `.env`)
const CLIENT_URL = process.env.CLIENT_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// CORS Middleware (Allows requests from frontend)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);

// Session Middleware (Persists user session)
app.use(session({
    store: new pgSession({
        pool, // Use PostgreSQL pool
        tableName: 'session', // Default session table name
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: "none", // Required for cross-origin cookies
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        //domain: process.env.NODE_ENV === 'production' ? ".progresstify.vercel.app" : undefined
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Debugging: Check if user is authenticated
app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    console.log("User:", req.user);
    next();
});

// Authentication & User Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.render("index", { user: req.user }); // Render the index.ejs file
});

// Protected API Route (Only accessible if authenticated)
app.get("/api/data", ensureAuthenticated, (req, res) => {
  console.log("Session Data:", req.session);
  console.log("User:", req.user); // Should NOT be undefined
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
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

// Debugging: Check session data
app.get('/debug-session', (req, res) => {
    console.log("🔍 Session Data:", req.session);
    console.log("👤 req.user:", req.user);
    res.json({ session: req.session, user: req.user });
});

// Google OAuth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        console.log("✅ Login Success! Redirecting...");
        res.redirect('/dashboard');
    }
);

app.get("/login", (req, res) => {
    res.render("login"); // Render the login.ejs file
});

app.get("/dashboard", ensureAuthenticated, (req, res) => {
    if (!req.user) {
        return res.redirect("/login"); // Redirect to login if not authenticated
    }
    res.render("dashboard", { user: req.user }); // Render the dashboard.ejs file
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));