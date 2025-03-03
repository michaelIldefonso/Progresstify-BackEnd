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

// Admin check middleware
// const ensureAdmin = async (req, res, next) => {
//   if (req.user) {
//     try {
//       const roleResult = await pool.query('SELECT name FROM roles WHERE id = $1', [req.user.role_id]);
//       if (roleResult.rows.length > 0 && roleResult.rows[0].name === 'admin') {
//         next();
//       } else {
//         res.status(403).json({ error: 'Forbidden' });
//       }
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   } else {
//     res.status(403).json({ error: 'Forbidden' });
//   }
// };

app.get("/api/users", ensureAuthenticated, async (req, res) => {
  try {
      const result = await pool.query(
          "SELECT id, email FROM users" // Fetch users without sensitive data
      );
      res.json(result.rows);
  } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: err.message });
  }
});

app.get('/api/data', ensureAuthenticated, (req, res) => {
  // Example data to be sent in response
  const data = {
    message: 'This is some data from the API',
    userId: req.user.id,
    userEmail: req.user.email,
  };
  res.json(data);
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
