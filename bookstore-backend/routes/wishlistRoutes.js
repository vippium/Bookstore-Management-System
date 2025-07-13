const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addToWishlist);
router.get("/", protect, getMyWishlist);
router.delete("/:bookId", protect, removeFromWishlist);

module.exports = router;
