const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createOrder);            // Place new order
router.get('/', protect, getUserOrders);           // Get own orders

// Admin-only routes
router.get('/all', protect, adminOnly, getAllOrders);      // All orders
router.put('/:id/status', protect, adminOnly, updateOrderStatus); // Update status

module.exports = router;
