const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require("../models/SubSection")

// ================= CREATE SECTION =================
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and Course ID required",
      })
    }

    const newSection = await Section.create({ sectionName })

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ================= UPDATE SECTION =================
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body

    await Section.findByIdAndUpdate(sectionId, { sectionName })

    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ================= DELETE SECTION =================
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body

    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    })

    const section = await Section.findById(sectionId)
    if (section) {
      await SubSection.deleteMany({ _id: { $in: section.subSection } })
      await Section.findByIdAndDelete(sectionId)
    }

    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })

    return res.status(200).json({
      success: true,
      data: updatedCourse,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}