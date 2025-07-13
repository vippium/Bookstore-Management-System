const express = require("express");
const router = express.Router();
const {
  getOrderStats,
  getTopGenres,
} = require("../controllers/analyticsController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/orders", protect, adminOnly, getOrderStats);
router.get("/genres", protect, adminOnly, getTopGenres);

module.exports = router;
