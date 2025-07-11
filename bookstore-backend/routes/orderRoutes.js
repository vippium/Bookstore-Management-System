const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getUserOrderStats,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);
router.get("/stats/mine", protect, getUserOrderStats);


module.exports = router;
