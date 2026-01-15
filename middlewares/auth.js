// Importing required modules
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const User = require("../models/User")

// Load environment variables
dotenv.config()

// ===================== AUTH MIDDLEWARE =====================
exports.auth = async (req, res, next) => {
  try {
    // Safely extract token
    const authHeader = req.header("Authorization")

    const token =
      req.cookies?.token ||
      req.body?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    next()
  } catch (error) {
    console.error("AUTH ERROR ❌", error)
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    })
  }
}

// ===================== IS STUDENT =====================
exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email })

    if (
      !userDetails ||
      userDetails.accountType.toLowerCase() !== "student"
    ) {
      return res.status(403).json({
        success: false,
        message: "This route is for Students only",
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role verification failed",
    })
  }
}

// ===================== IS INSTRUCTOR =====================
exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email })

    if (
      !userDetails ||
      userDetails.accountType.toLowerCase() !== "instructor"
    ) {
      return res.status(403).json({
        success: false,
        message: "This route is for Instructors only",
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role verification failed",
    })
  }
}

// ===================== IS ADMIN =====================
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email })

    if (
      !userDetails ||
      userDetails.accountType.toLowerCase() !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "This route is for Admin only",
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role verification failed",
    })
  }
}
