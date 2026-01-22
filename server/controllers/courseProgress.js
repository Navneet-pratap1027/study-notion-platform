const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

// ================= UPDATE COURSE PROGRESS =================
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.body
    const userId = req.user.id

    // ---------------- VALIDATION ----------------
    if (!courseId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "courseId and subsectionId are required",
      })
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(subsectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId or subsectionId",
      })
    }

    // ---------------- CHECK SUBSECTION ----------------
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      })
    }

    // ---------------- CHECK COURSE ----------------
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // ---------------- FIND COURSE PROGRESS ----------------
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress does not exist for this user",
      })
    }

    // ---------------- DUPLICATE CHECK ----------------
    const alreadyCompleted = courseProgress.completedVideos?.includes(
      subsectionId
    )

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: "Subsection already marked as completed",
      })
    }

    // ---------------- UPDATE PROGRESS ----------------
    courseProgress.completedVideos.push(subsectionId)
    await courseProgress.save()

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
    })
  } catch (error) {
    console.error("updateCourseProgress error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// ================= GET COURSE PROGRESS PERCENTAGE =================
exports.getProgressPercentage = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      })
    }

    // ---------------- FIND COURSE PROGRESS ----------------
    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })
      .populate({
        path: "courseID",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" },
        },
      })
      .exec()

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      })
    }

    // ---------------- TOTAL LECTURES ----------------
    let totalLectures = 0

    courseProgress.courseID.courseContent?.forEach((section) => {
      totalLectures += section.subSection?.length || 0
    })

    // ---------------- COMPLETED LECTURES ----------------
    const completedLectures =
      courseProgress.completedVideos?.length || 0

    // ---------------- PROGRESS % ----------------
    const progressPercentage =
      totalLectures === 0
        ? 100
        : Math.round((completedLectures / totalLectures) * 100)

    return res.status(200).json({
      success: true,
      data: progressPercentage,
      message: "Course progress fetched successfully",
    })
  } catch (error) {
    console.error("getProgressPercentage error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
