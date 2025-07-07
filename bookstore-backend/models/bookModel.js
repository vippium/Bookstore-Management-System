const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  price: Number,
  stock: Number,
  ISBN: String,
  description: String,
  imageUrl: String // ✅ this must be included
});

module.exports = mongoose.model("Book", bookSchema);
