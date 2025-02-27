require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./src/config/auth');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cors = require("cors"); // ✅ Import cors
const ensureAuthenticated = require('./src/middleware/authMiddleware');
const pool = require('./src/config/db'); // ✅ Ensure you have the DB connection

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Middleware
app.use(cors({
    origin: "https://progresstify.vercel.app", // ✅ Allow frontend requests
    credentials: true
}));

// ✅ Session Middleware (Only One)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ✅ Only secure in production
        sameSite: "none", // ✅ Allow cookies across subdomains
        domain: ".progresstify.vercel.app" // ✅ Enable session sharing
    }
}));

// ✅ Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Debugging: Check if req.user is available
app.use((req, res, next) => {
    console.log("Session Data:", req.session);
    console.log("User:", req.user);
    next();
});

// ✅ Test API Route (Check if User is Authenticated)
app.get("/api/data", ensureAuthenticated, (req, res) => {
    res.json({ message: `Hello, ${req.user.name}!` });
});

// ✅ Get User Data (Check Role)
app.get("/api/users", ensureAuthenticated, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, role_id FROM users WHERE email = $1",
            [req.user.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]); // ✅ Return real user data
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Authentication & User Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
