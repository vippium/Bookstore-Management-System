const Wishlist = require("../models/wishlistModel");

const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const exists = await Wishlist.findOne({ user: req.user._id, book: bookId });

    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = await Wishlist.create({ user: req.user._id, book: bookId });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

const getMyWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate("book");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user._id,
      book: req.params.bookId,
    });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove", error: err.message });
  }
};

module.exports = {
  addToWishlist,
  getMyWishlist,
  removeFromWishlist,
};
