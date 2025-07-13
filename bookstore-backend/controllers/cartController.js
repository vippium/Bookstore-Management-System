const Cart = require("../models/cartModel");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart?.items || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to load cart" });
  }
};

const saveCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid cart data" });
    }

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { upsert: true, new: true }
    );

    res.json({ message: "Cart saved" });
  } catch (err) {
    console.error("🛑 Save cart error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to save cart", error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = { getCart, saveCart, clearCart };
