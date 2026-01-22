import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { courseEndpoints, categoriesEndpoints } from "../apis"

// ================= ENDPOINTS =================
const {
  ADD_COURSE_API,
  EDIT_COURSE_API,
  DELETE_COURSE_API,
  CREATE_SECTION_API,
  UPDATE_SECTION_API,
  DELETE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SUBSECTION_API,
  GET_FULL_COURSE_DETAILS_API,
  INSTRUCTOR_COURSES_API,
  CREATE_RATING_API,
  MARK_LECTURE_COMPLETE_API,
} = courseEndpoints

const { GET_ALL_CATEGORIES_API } = categoriesEndpoints

// ================= ERROR HANDLER =================
const errorHandler = (error, fallback) => {
  toast.error(
    error?.response?.data?.message ||
      error?.message ||
      fallback
  )
}

// ================= CATEGORIES =================
export const fetchCourseCategories = async () => {
  try {
    const res = await apiConnector("GET", GET_ALL_CATEGORIES_API)
    return res.data.data
  } catch (error) {
    errorHandler(error, "Failed to load categories")
    return []
  }
}

// ================= COURSE CREATE =================
export const addCourseDetails = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      ADD_COURSE_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    toast.success("Course created")
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to create course")
    return null
  }
}

// ================= COURSE EDIT =================
export const editCourseDetails = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      EDIT_COURSE_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    toast.success("Course updated")
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to update course")
    return null
  }
}

// ================= COURSE DETAILS (PUBLIC) =================
export const fetchCourseDetails = async (courseId) => {
  try {
    const res = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_API,
      { courseId }
    )
    return res.data.data
  } catch (error) {
    errorHandler(error, "Failed to fetch course details")
    return null
  }
}
// ================= COURSE DETAILS (AUTH) =================
export const getFullDetailsOfCourse = async (courseId, token) => {
  try {
    const res = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_API,
      { courseId },
      token ? { Authorization: `Bearer ${token}` } : undefined
    )
    return res.data.data
  } catch (error) {
    errorHandler(error, "Failed to fetch full course details")
    return null
  }
}
// ================= DELETE COURSE =================
export const deleteCourse = async (courseId, token) => {
  try {
    const res = await apiConnector(
      "POST",
      DELETE_COURSE_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )
    toast.success("Course deleted")
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to delete course")
    return null
  }
}

// ================= SECTION =================
export const createSection = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      CREATE_SECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to create section")
    return null
  }
}

export const updateSection = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      UPDATE_SECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to update section")
    return null
  }
}

export const deleteSection = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      DELETE_SECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to delete section")
    return null
  }
}

// ================= SUB SECTION =================
export const createSubSection = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      CREATE_SUBSECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to add lecture")
    return null
  }
}

export const updateSubSection = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      UPDATE_SUBSECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to update lecture")
    return null
  }
}

export const deleteSubSection = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      DELETE_SUBSECTION_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to delete lecture")
    return null
  }
}

// ================= OTHERS =================
export const fetchInstructorCourses = async (token) => {
  try {
    const res = await apiConnector(
      "GET",
      INSTRUCTOR_COURSES_API,
      null,
      { Authorization: `Bearer ${token}` }
    )
    return res.data.data
  } catch (error) {
    errorHandler(error, "Failed to load instructor courses")
    return []
  }
}

export const createRating = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      CREATE_RATING_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to submit rating")
    return null
  }
}

export const markLectureAsComplete = async (data, token) => {
  try {
    const res = await apiConnector(
      "POST",
      MARK_LECTURE_COMPLETE_API,
      data,
      { Authorization: `Bearer ${token}` }
    )
    return res.data
  } catch (error) {
    errorHandler(error, "Failed to mark lecture complete")
    return null
  }
}
