const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    resendOtp,
    deleteUser,
    updateProfile,
    getMe,
    changePassword,
    verifyOtp,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/resend-otp", resendOtp);
router.post("/verify", verifyOtp);

// Protected routes
router.delete("/delete", protect, deleteUser);
router.put("/update", protect, updateProfile);
router.put("/password", protect, changePassword);
router.get("/me", protect, getMe);

module.exports = router;