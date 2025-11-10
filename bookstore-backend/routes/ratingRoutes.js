const express = require("express");
const router = express.Router();
const {
  addOrUpdateRating,
  getBookRatings,
  getMyRatings,
  deleteRating,
} = require("../controllers/ratingController");
const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: User ratings and reviews for books
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         book:
 *           type: string
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *           example: "Loved this book!"
 */

/**
 * @swagger
 * /api/ratings/{bookId}:
 *   post:
 *     summary: Add or update a rating for a book
 *     security:
 *       - BearerAuth: []
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Incredible book, highly recommended!"
 *     responses:
 *       201:
 *         description: Rating added/updated successfully
 */
router.post("/:bookId", protect, addOrUpdateRating);

/**
 * @swagger
 * /api/ratings/book/{bookId}:
 *   get:
 *     summary: Get all ratings for a book
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ratings retrieved
 */
router.get("/book/:bookId", getBookRatings);

/**
 * @swagger
 * /api/ratings/mine:
 *   get:
 *     summary: Get my ratings
 *     security:
 *       - BearerAuth: []
 *     tags: [Ratings]
 *     responses:
 *       200:
 *         description: User ratings retrieved
 */
router.get("/mine", protect, getMyRatings);

/**
 * @swagger
 * /api/ratings/{ratingId}:
 *   delete:
 *     summary: Delete a rating
 *     security:
 *       - BearerAuth: []
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 */
router.delete("/:ratingId", protect, deleteRating);

module.exports = router;
