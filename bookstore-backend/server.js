const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cartRoutes = require("./routes/cartRoutes");

// Middleware
const { protect } = require("./middleware/authMiddleware");

// Swagger
const swaggerDocs = require("./swagger");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Protected test route
app.get("/api/secret", protect, (req, res) => {
  res.json({
    message: `Hello ${req.user.name}, you're logged in.`,
    user: req.user,
  });
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

// Root health check
app.get("/", (req, res) => {
  res.send("📚 Bookstore API is running...");
});

// Swagger Docs
swaggerDocs(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
