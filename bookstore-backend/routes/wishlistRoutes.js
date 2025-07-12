const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/wishlist
// @desc    Add a book to wishlist
router.post("/", protect, addToWishlist);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
router.get("/", protect, getMyWishlist);

// @route   DELETE /api/wishlist/:bookId
// @desc    Remove a book from wishlist
router.delete("/:bookId", protect, removeFromWishlist);

module.exports = router;
