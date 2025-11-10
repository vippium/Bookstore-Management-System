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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Manage customer orders
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *               quantity:
 *                 type: integer
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *     OrderInput:
 *       type: object
 *       required: [items, totalAmount]
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *               quantity:
 *                 type: integer
 *         totalAmount:
 *           type: number
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create new order
 *     security:
 *       - BearerAuth: []
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order details
 */
router.post("/", protect, createOrder);

/**
 * @swagger
 * /api/orders/mine:
 *   get:
 *     summary: Get logged-in user's orders
 *     security:
 *       - BearerAuth: []
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: User orders fetched successfully
 */
router.get("/mine", protect, getMyOrders);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     security:
 *       - BearerAuth: []
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, adminOnly, getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order status
 *     security:
 *       - BearerAuth: []
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put("/:id", protect, adminOnly, updateOrderStatus);

/**
 * @swagger
 * /api/orders/stats/mine:
 *   get:
 *     summary: Get user order statistics
 *     security:
 *       - BearerAuth: []
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: User order stats retrieved
 */
router.get("/stats/mine", protect, getUserOrderStats);

module.exports = router;
