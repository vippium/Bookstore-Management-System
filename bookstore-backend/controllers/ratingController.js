const Rating = require("../models/ratingModel");
const Book = require("../models/bookModel");

const addOrUpdateRating = async (req, res) => {
  try {
    const { stars, review } = req.body;
    const { bookId } = req.params;

    if ((!stars || stars < 1 || stars > 5) && !review?.trim()) {
      return res
        .status(400)
        .json({ message: "Please provide a rating or a review" });
    }

    let rating = await Rating.findOne({ book: bookId, user: req.user._id });

    if (rating) {
      if (stars >= 1 && stars <= 5) rating.stars = stars;
      if (review !== undefined) rating.review = review;
      await rating.save();
      return res.json({ message: "Rating updated", rating });
    }

    rating = await Rating.create({
      book: bookId,
      user: req.user._id,
      userName: req.user.name,
      stars: stars >= 1 && stars <= 5 ? stars : undefined,
      review,
    });

    res.status(201).json({ message: "Rating added", rating });
  } catch (err) {
    res.status(500).json({ message: "Rating failed", error: err.message });
  }
};

const getBookRatings = async (req, res) => {
  try {
    const { bookId } = req.params;
    const ratings = await Rating.find({ book: bookId }).sort({ createdAt: -1 });

    const count = ratings.length;
    const total = ratings.reduce((sum, r) => sum + r.stars, 0);
    const avgRating = count > 0 ? total / count : 0;

    res.json({
      count,
      avgRating,
      ratings,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load ratings", error: err.message });
  }
};

const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id }).populate(
      "book",
      "title imageUrl"
    );
    res.json(ratings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch your ratings", error: err.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.ratingId);

    if (!rating) return res.status(404).json({ message: "Rating not found" });
    if (String(rating.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your rating" });
    }

    await rating.deleteOne();
    res.json({ message: "Rating deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = {
  addOrUpdateRating,
  getBookRatings,
  getMyRatings,
  deleteRating,
};
