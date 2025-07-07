const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  genre: String,
  stock: {
    type: Number,
    default: 0
  },
  ISBN: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
