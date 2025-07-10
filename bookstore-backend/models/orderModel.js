const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
      title: String,
      price: Number,
      quantity: Number,
    },
  ],
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);
