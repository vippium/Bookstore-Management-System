const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const { protect } = require("./middleware/authMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Middlewares

app.get("/api/secret", protect, (req, res) => {
  res.json({
    message: `Hello ${req.user.name}, you're logged in.`,
    user: req.user,
  });
});

// Routes
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use('/api/auth', authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
