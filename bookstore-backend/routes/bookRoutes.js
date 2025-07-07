const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Admin-only Routes
router.post('/', protect, adminOnly, addBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
