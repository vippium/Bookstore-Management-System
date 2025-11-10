const express = require("express");
const router = express.Router();
const {
  getOrderStats,
  getTopGenres,
} = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Reports and insights for admin
 */

/**
 * @swagger
 * /api/analytics/orders:
 *   get:
 *     summary: Get order analytics
 *     description: Retrieve order count, total revenue, and sales trends.
 *     security:
 *       - BearerAuth: []
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Order analytics data retrieved
 */
router.get("/orders", protect, adminOnly, getOrderStats);

/**
 * @swagger
 * /api/analytics/genres:
 *   get:
 *     summary: Get top genres by sales
 *     security:
 *       - BearerAuth: []
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Top-selling genres retrieved
 */
router.get("/genres", protect, adminOnly, getTopGenres);

module.exports = router;
