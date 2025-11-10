const express = require("express");
const router = express.Router();
const {
  getCart,
  saveCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Manage your shopping cart
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
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
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     security:
 *       - BearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Returns user's cart items
 */
router.get("/", protect, getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Save or update cart
 *     security:
 *       - BearerAuth: []
 *     tags: [Cart]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart saved successfully
 */
router.post("/", protect, saveCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear cart
 *     security:
 *       - BearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete("/", protect, clearCart);

module.exports = router;
