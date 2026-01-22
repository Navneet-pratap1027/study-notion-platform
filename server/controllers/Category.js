const Category = require("../models/Category")
const slugify = require("slugify")

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      })
    }

    // Slugify ensures names like "Data Science" become "data-science"
    const slug = slugify(name, { lower: true })

    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      })
    }

    const category = await Category.create({
      name,
      slug,
      description,
    })

    return res.status(200).json({
      success: true,
      data: category,
      message: "Category created successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// SHOW ALL CATEGORIES
exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { name: 1, slug: 1, description: 1 })

    return res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// CATEGORY PAGE DETAILS
exports.categoryPageDetails = async (req, res) => {
  try {
    const { catalogName } = req.params;
    console.log("Searching for slug:", catalogName); // ✅ Debug Log

    // 1. Get details for the selected category
    const selectedCategory = await Category.findOne({ slug: catalogName })
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "instructor" },
      })
      .exec();

    // Handle case where category is not found
    if (!selectedCategory) {
      console.log("Category not found in DB for slug:", catalogName); //  Debug Log
      return res.status(404).json({
        success: false,
        message: `Category '${catalogName}' not found. Please check slug in DB.`,
      })
    }

    // Handle case where there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No published courses found for this category.");
    }

    // 2. Get courses for other categories (for suggestions)
    const categoriesExceptSelected = await Category.find({
      slug: { $ne: catalogName },
    });

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories: categoriesExceptSelected,
      },
    })
  } catch (error) {
    console.error("CATALOG PAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}