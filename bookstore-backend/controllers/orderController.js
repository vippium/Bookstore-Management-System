const Order = require('../models/orderModel');
const Book = require('../models/bookModel');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (customer)
const createOrder = async (req, res) => {
  const { books, totalPrice } = req.body;

  if (!books || books.length === 0) {
    return res.status(400).json({ message: 'No books in order' });
  }

  try {
    // Optional: validate book IDs and quantities here

    const order = await Order.create({
      user: req.user._id,
      books,
      totalPrice,
      paymentStatus: 'pending',
      status: 'processing'
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('books.book');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch orders', error: err.message });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders/all
// @access  Private (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('books.book');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load all orders', error: err.message });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};
