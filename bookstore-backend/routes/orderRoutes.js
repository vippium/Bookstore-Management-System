const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getMyOrders,
  getAllOrders,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");


router.get("/mine", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.post("/", protect, createOrder);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
