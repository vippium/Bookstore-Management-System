const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  deleteUser,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/delete", protect, deleteUser);
router.put("/update", protect, updateProfile);

module.exports = router;
