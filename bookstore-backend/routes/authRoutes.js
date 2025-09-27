const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    deleteUser,
    updateProfile,
    getMe,
    changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Protected routes
router.delete("/delete", protect, deleteUser);
router.put("/update", protect, updateProfile);
router.put("/password", protect, changePassword);
router.get("/me", protect, getMe);

module.exports = router;