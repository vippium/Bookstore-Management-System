const express = require("express");
const router = express.Router();
const { getCart, saveCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// 📥 GET user's cart
router.get("/", protect, getCart);

// 💾 POST (save/update) cart
router.post("/", protect, saveCart);

// 🧹 DELETE cart
router.delete("/", protect, clearCart);

module.exports = router;
