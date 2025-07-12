const express = require("express");
const router = express.Router();
const {
  addOrUpdateRating,
  getBookRatings,
  getMyRatings,
  deleteRating,
} = require("../controllers/ratingController");

const { protect } = require("../middleware/authMiddleware");

router.post("/:bookId", protect, addOrUpdateRating);
router.get("/book/:bookId", getBookRatings);
router.get("/mine", protect, getMyRatings);
router.delete("/:ratingId", protect, deleteRating);

module.exports = router;
