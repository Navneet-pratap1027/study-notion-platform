const express = require("express")
const router = express.Router()

// ===== CONTROLLERS =====
const courseController = require("../controllers/Course")
const sectionController = require("../controllers/Section")
const subSectionController = require("../controllers/SubSection")
const ratingController = require("../controllers/RatingAndReview")
const categoryController = require("../controllers/Category")

// ===== DESTRUCTURE CONTROLLERS =====
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = courseController

const {
  createSection,
  updateSection,
  deleteSection,
} = sectionController

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = subSectionController

const {
  createRating,
  getAverageRating,
  getAllRating,
} = ratingController

// ✅ Destructure categoryPageDetails here
const {
  showAllCategories,
  createCategory,
  categoryPageDetails, // 👈 Ye missing tha
} = categoryController

// ===== MIDDLEWARE =====
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// ===== COURSE ROUTES =====
router.post("/createCourse", auth, isInstructor, createCourse)
router.get("/getAllCourses", getAllCourses)
router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/editCourse", auth, isInstructor, editCourse)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/deleteCourse", auth, isInstructor, deleteCourse)

// ===== CATEGORY ROUTES =====
router.post("/createCategory", auth, isAdmin, createCategory) // Admin can create
router.get("/showAllCategories", showAllCategories)
// ✅ YE ROUTE MISSING THA: catalogName slug accept karne ke liye
router.get("/getCategoryPageDetails/:catalogName", categoryPageDetails) 

// ===== SECTION ROUTES =====
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)

// ===== SUB-SECTION ROUTES =====
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

// ===== RATING ROUTES =====
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router