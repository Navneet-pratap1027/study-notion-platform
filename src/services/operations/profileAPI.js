import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector" // ✅ FIXED CASE
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

// ================= GET USER DETAILS =================
export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector(
        "GET",
        GET_USER_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )

      if (!response?.data?.success) {
        throw new Error(response?.data?.message)
      }

      const user = response.data.data

      const userImage = user.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`

      dispatch(setUser({ ...user, image: userImage }))
    } catch (error) {
      // ✅ logout ONLY if token invalid
      if (error?.response?.status === 401) {
        dispatch(logout(navigate))
      }
      toast.error("Could not fetch user details")
    }

    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

// ================= GET USER ENROLLED COURSES =================
export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message)
    }

    result = response.data.data
  } catch (error) {
    toast.error("Could not get enrolled courses")
  }

  toast.dismiss(toastId)
  return result
}

// ================= GET INSTRUCTOR DATA =================
export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector(
      "GET",
      GET_INSTRUCTOR_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    // ✅ SAFE & CONSISTENT
    result = response?.data?.data ?? []
  } catch (error) {
    toast.error("Could not get instructor data")
  }

  toast.dismiss(toastId)
  return result
}