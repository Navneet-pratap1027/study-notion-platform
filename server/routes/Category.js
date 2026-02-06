const express = require("express");
const router = express.Router();

const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Category");

const { auth, isAdmin } = require("../middlewares/auth");

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);

//  IMPORTANT
router.get("/:catalogName", categoryPageDetails);

module.exports = router;
