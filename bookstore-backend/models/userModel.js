const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 🧍 Basic Info
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
    },

    // 🔐 Role & Verification
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ⏱️ Activity
    lastLogin: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
