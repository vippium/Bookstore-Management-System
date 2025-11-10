const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Manage your wishlist
 */

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add a book to wishlist
 *     security:
 *       - BearerAuth: []
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: 64b2f3c4e1a8a21b7a6f8b90
 *     responses:
 *       201:
 *         description: Book added to wishlist
 */
router.post("/", protect, addToWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get my wishlist
 *     security:
 *       - BearerAuth: []
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: List of wishlist items
 */
router.get("/", protect, getMyWishlist);

/**
 * @swagger
 * /api/wishlist/{bookId}:
 *   delete:
 *     summary: Remove book from wishlist
 *     security:
 *       - BearerAuth: []
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Book removed from wishlist
 */
router.delete("/:bookId", protect, removeFromWishlist);

module.exports = router;
