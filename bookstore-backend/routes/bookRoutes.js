const express = require("express");
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Manage books in the store
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b2f2b1e1a8a21b7a6f8b90
 *         title:
 *           type: string
 *           example: "The Great Gatsby"
 *         author:
 *           type: string
 *           example: "F. Scott Fitzgerald"
 *         genre:
 *           type: string
 *           example: "Classic"
 *         price:
 *           type: number
 *           example: 299.99
 *         stock:
 *           type: integer
 *           example: 20
 *         description:
 *           type: string
 *           example: "A novel set in the Jazz Age..."
 *     BookInput:
 *       type: object
 *       required: [title, author, genre, price, stock]
 *       properties:
 *         title:
 *           type: string
 *           example: "Atomic Habits"
 *         author:
 *           type: string
 *           example: "James Clear"
 *         genre:
 *           type: string
 *           example: "Self-help"
 *         price:
 *           type: number
 *           example: 499
 *         stock:
 *           type: integer
 *           example: 50
 *         description:
 *           type: string
 *           example: "An easy & proven way to build good habits and break bad ones."
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
router.get("/:id", getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     security:
 *       - BearerAuth: []
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, adminOnly, addBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     security:
 *       - BearerAuth: []
 *     tags: [Books]
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
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 */
router.put("/:id", protect, adminOnly, updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     security:
 *       - BearerAuth: []
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;
