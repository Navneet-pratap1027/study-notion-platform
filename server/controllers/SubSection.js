const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const Course = require("../models/Course")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// ================= CREATE SUB SECTION =================
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body

    if (!sectionId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: "Video is required",
      })
    }

    const upload = await uploadImageToCloudinary(
      req.files.video,
      process.env.FOLDER_NAME
    )

    const subSection = await SubSection.create({
      title,
      description,
      timeDuration: `${upload.duration}`,
      videoUrl: upload.secure_url,
    })

    await Section.findByIdAndUpdate(sectionId, {
      $push: { subSection: subSection._id },
    })

    // 🔥 IMPORTANT: RETURN FULL COURSE
    const course = await Course.findOne({
      courseContent: sectionId,
    }).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })

    return res.status(200).json({
      success: true,
      data: course,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// ================= UPDATE SUB SECTION =================
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body

    const sub = await SubSection.findById(subSectionId)
    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title) sub.title = title
    if (description) sub.description = description

    if (req.files?.video) {
      const upload = await uploadImageToCloudinary(
        req.files.video,
        process.env.FOLDER_NAME
      )
      sub.videoUrl = upload.secure_url
      sub.timeDuration = `${upload.duration}`
    }

    await sub.save()

    const course = await Course.findOne({
      courseContent: sectionId,
    }).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })

    return res.status(200).json({
      success: true,
      data: course,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// ================= DELETE SUB SECTION =================
exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body

    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSection: subSectionId },
    })

    await SubSection.findByIdAndDelete(subSectionId)

    const course = await Course.findOne({
      courseContent: sectionId,
    }).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })

    return res.status(200).json({
      success: true,
      data: course,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}