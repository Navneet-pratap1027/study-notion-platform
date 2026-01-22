const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body

    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const profile = await Profile.findById(user.additionalDetails)
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" })
    }

    user.firstName = firstName
    user.lastName = lastName
    await user.save()

    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender
    await profile.save()

    const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec()

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= DELETE ACCOUNT =================
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    await Profile.findByIdAndDelete(user.additionalDetails)

    for (const courseId of user.courses || []) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { studentsEnrolled: userId },
      })
    }

    await CourseProgress.deleteMany({ userId })
    await User.findByIdAndDelete(userId)

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted",
    })
  }
}

// ================= GET USER DETAILS =================
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id

    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec()

    return res.status(200).json({
      success: true,
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= UPDATE DISPLAY PICTURE =================
exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id
    const displayPicture = req.files.displayPicture

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= GET ENROLLED COURSES =================
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id

    let userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" },
        },
      })
      .exec()

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    userDetails = userDetails.toObject()

    for (const course of userDetails.courses || []) {
      let totalDurationInSeconds = 0
      let totalSubSections = 0

      for (const section of course.courseContent || []) {
        totalSubSections += section.subSection?.length || 0

        totalDurationInSeconds +=
          section.subSection?.reduce(
            (acc, curr) => acc + Number(curr.timeDuration || 0),
            0
          ) || 0
      }

      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds)

      const progress = await CourseProgress.findOne({
        courseID: course._id,
        userId,
      })

      const completedVideos = progress?.completedVideos?.length || 0

      course.progressPercentage =
        totalSubSections === 0
          ? 100
          : Math.round((completedVideos / totalSubSections) * 100)
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ================= INSTRUCTOR DASHBOARD (FIXED) =================
exports.instructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })

    const dashboardData = courses.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled?.length || 0
      const totalAmountGenerated =
        totalStudentsEnrolled * (course.price || 0)

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      }
    })

    return res.status(200).json({
      success: true,
      courses: dashboardData,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}
