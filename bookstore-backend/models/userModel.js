const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please enter your name"] },
    email: { type: String, required: [true, "Please enter your email"], unique: true },
    password: { type: String, required: [true, "Please enter your password"], select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date },
    lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);