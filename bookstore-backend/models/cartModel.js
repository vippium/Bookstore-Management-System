const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
        title: String,
        price: Number,
        quantity: Number,
        imageUrl: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
