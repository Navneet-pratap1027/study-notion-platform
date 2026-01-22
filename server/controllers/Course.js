const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// ================= CREATE COURSE =================
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
      instructions,
      status,
    } = req.body

    if (!req.files?.thumbnailImage) {
      return res.status(400).json({ success: false, message: "Thumbnail required" })
    }

    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category) {
      return res.status(400).json({ success: false, message: "All fields required" })
    }

    const instructor = await User.findById(userId)
    const categoryDetails = await Category.findById(category)

    const thumbnail = await uploadImageToCloudinary(
      req.files.thumbnailImage,
      process.env.FOLDER_NAME
    )

    const course = await Course.create({
      courseName,
      courseDescription,
      instructor: instructor._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnail.secure_url,
      tag,
      instructions,
      status: status || "Draft",
    })

    await User.findByIdAndUpdate(instructor._id, {
      $push: { courses: course._id },
    })

    await Category.findByIdAndUpdate(categoryDetails._id, {
      $push: { courses: course._id },
    })

    return res.status(200).json({ success: true, data: course })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= GET ALL COURSES =================
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "Published" })
      .populate("instructor")
      .populate("category")

    return res.status(200).json({ success: true, data: courses })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= COURSE DETAILS =================
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
      .populate("instructor")
      .populate("category")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" })
    }

    return res.status(200).json({ success: true, data: course })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= FULL COURSE DETAILS =================
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })

    return res.status(200).json({ success: true, data: course })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= EDIT COURSE =================
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body

    const course = await Course.findByIdAndUpdate(courseId, updates, { new: true })
    return res.status(200).json({ success: true, data: course })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= INSTRUCTOR COURSES =================
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, data: courses })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= DELETE COURSE =================
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    await Course.findByIdAndDelete(courseId)
    return res.status(200).json({ success: true, message: "Course deleted" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
