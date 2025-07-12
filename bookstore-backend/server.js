const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const { protect } = require("./middleware/authMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require("./routes/wishlistRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 🔒 Auth check route
app.get("/api/secret", protect, (req, res) => {
  res.json({
    message: `Hello ${req.user.name}, you're logged in.`,
    user: req.user,
  });
});

// 📦 Routes
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/ratings", ratingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", require("./routes/cartRoutes"));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
