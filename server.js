const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('./src/config/auth');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cors = require("cors"); // ✅ Import cors


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors()); // Allow frontend requests


app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});

app.listen(5173, () => console.log("Backend running on port 8000"));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
