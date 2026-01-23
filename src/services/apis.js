// const BASE_URL = "http://localhost:4000/api/v1"
const BASE_URL = process.env.REACT_APP_BASE_URL;


// ================= AUTH =================
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// ================= PROFILE =================
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// ================= STUDENT / PAYMENT =================
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API:
    BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// ================= COURSE =================
export const courseEndpoints = {
  // course CRUD
  ADD_COURSE_API: BASE_URL + "/course/createCourse",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",

  // course fetch
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  GET_FULL_COURSE_DETAILS_API:
    BASE_URL + "/course/getFullCourseDetails",
  INSTRUCTOR_COURSES_API:
    BASE_URL + "/course/getInstructorCourses",

  // section
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",

  // subsection
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",

  // progress & rating
  MARK_LECTURE_COMPLETE_API:
    BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// ================= CATEGORIES =================
export const categoriesEndpoints = {
  GET_ALL_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}

// ================= RATINGS =================
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// ================= CATALOG =================
export const catalogData = {
  CATALOGPAGEDATA_API:
    BASE_URL + "/course/getCategoryPageDetails",
}

// ================= CONTACT =================
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// ================= SETTINGS =================
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API:
    BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}
