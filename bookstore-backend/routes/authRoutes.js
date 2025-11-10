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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for user authentication, registration, and profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b2f1b3e1a8a21b7a6f8b90
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         role:
 *           type: string
 *           example: user
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Invalid credentials
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           example: jane@example.com
 *         password:
 *           type: string
 *           example: Password123
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: password123
 *     VerifyOtpInput:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         otp:
 *           type: string
 *           example: 123456
 *     UpdateProfileInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Johnathan Doe
 *         email:
 *           type: string
 *           example: john_new@example.com
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: oldPassword123
 *         newPassword:
 *           type: string
 *           example: newPassword456
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and sends OTP verification email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User successfully registered (OTP sent)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for registration
 *     description: Validates OTP for a registered user and activates the account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpInput'
 *     responses:
 *       200:
 *         description: OTP verified, user activated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Email not found or user already verified
 */
router.post("/resend-otp", resendOtp);

/**
 * @swagger
 * /api/auth/delete:
 *   delete:
 *     summary: Delete user account
 *     security:
 *       - BearerAuth: []
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete", protect, deleteUser);

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Update user profile
 *     description: Update name or email of the logged-in user.
 *     security:
 *       - BearerAuth: []
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put("/update", protect, updateProfile);

/**
 * @swagger
 * /api/auth/password:
 *   put:
 *     summary: Change password
 *     security:
 *       - BearerAuth: []
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put("/password", protect, changePassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     description: Fetch profile details using the JWT token.
 *     security:
 *       - BearerAuth: []
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Returns user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", protect, getMe);

module.exports = router;
