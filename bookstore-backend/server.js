const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleware");

const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config();
connectDB();

const app = express();

// ---------------------- CORS ----------------------
const allowedOrigins = [
    "http://localhost:5173",
    "https://bookstore-beige-psi-99.vercel.app",
];

app.use(
    cors({
        origin: function(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

// ---------------------- Routes ----------------------
app.get("/api/secret", protect, (req, res) => {
    res.json({
        message: `Hello ${req.user.name}, you're logged in.`,
        user: req.user,
    });
});

app.use("/api/books", bookRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

// ---------------------- Health Check ----------------------
app.get("/", (req, res) => {
    res.send("📚 Bookstore API is running...");
});

// ---------------------- Server ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});