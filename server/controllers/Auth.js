const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
    } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const approved = accountType === "Instructor" ? false : true;

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    /* ===== AUTO LOGIN AFTER SIGNUP ===== */
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "Signup successful & logged in",
    });
  } catch (error) {
    // PURANA CATCH BLOCK HATA KAR YE DAALEIN:
    console.error("DEBUG SIGNUP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message,
    });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Login successful",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Password incorrect",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/* ================= CHANGE PASSWORD ================= */
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);

    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password incorrect",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true },
    );

    try {
      await mailSender(
        updatedUser.email,
        "Password updated",
        passwordUpdated(updatedUser.email, `Password updated successfully`),
      );
    } catch (error) {
      console.error("Email error:", error);
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password update failed",
    });
  }
};
