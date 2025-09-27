const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { getOtpEmailTemplate } = require("../utils/emailTemplates");

// ---------------------- Helpers ----------------------
const generateToken = (user) => {
    return jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET, { expiresIn: "7d" }
    );
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ---------------------- Register ----------------------
const registerUser = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res
                .status(409)
                .json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry: Date.now() + 15 * 60 * 1000,
        });

        // Send OTP Email
        await sendEmail({
            to: email,
            subject: "Verify your Bookstore account",
            html: getOtpEmailTemplate({ name, otp, type: "register" }),
        });

        res.status(201).json({
            success: true,
            message: "Registered successfully. Please verify your email.",
            userId: user._id,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

// ---------------------- Login ----------------------
const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password +otp +otpExpiry");
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        if (!user.isVerified) {
            const otp = generateOtp();
            user.otp = otp;
            user.otpExpiry = Date.now() + 15 * 60 * 1000;
            await user.save();

            await sendEmail({
                to: email,
                subject: "Verify your Bookstore login",
                html: getOtpEmailTemplate({ name: user.name, otp, type: "login" }),
            });

            return res.status(403).json({
                message: "Email not verified. Check your inbox for OTP.",
                userId: user._id,
            });
        }

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ---------------------- Verify OTP ----------------------
const verifyOtp = async(req, res) => {
    const { userId, otp } = req.body;

    try {
        const user = await User.findById(userId).select("+otp +otpExpiry");

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isVerified)
            return res.status(400).json({ message: "User already verified" });

        if (!user.otp || !user.otpExpiry)
            return res
                .status(400)
                .json({ message: "No OTP found. Please request again." });

        if (user.otp !== otp)
            return res.status(400).json({ message: "Incorrect OTP" });

        if (user.otpExpiry < Date.now())
            return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({
            message: "OTP verified successfully",
            token: generateToken(user),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "OTP verification failed", error: err.message });
    }
};

// ---------------------- Resend OTP ----------------------
const resendOtp = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.isVerified)
            return res.status(400).json({ message: "User already verified" });

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendEmail({
            to: email,
            subject: "Your new Bookstore OTP",
            html: getOtpEmailTemplate({ name: user.name, otp, type: "register" }),
        });

        res.status(200).json({ message: "OTP resent successfully" });
    } catch (err) {
        res.status(500).json({ message: "Resend OTP failed", error: err.message });
    }
};

// ---------------------- Delete User ----------------------
const deleteUser = async(req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.status(200).json({ message: "User account deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ---------------------- Update Profile ----------------------
const updateProfile = async(req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// ---------------------- Get Me ----------------------
const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ---------------------- Change Password ----------------------
const changePassword = async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both fields are required" });
        }

        const user = await User.findById(req.user._id).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update password", error: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    deleteUser,
    updateProfile,
    getMe,
    changePassword,
};