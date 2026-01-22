const express = require("express")
const router = express.Router()

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection")


const { auth, isInstructor } = require("../middlewares/auth")

router.post("/add", auth, isInstructor, createSubSection)
router.post("/update", auth, isInstructor, updateSubSection)
router.post("/delete", auth, isInstructor, deleteSubSection)

module.exports = router
