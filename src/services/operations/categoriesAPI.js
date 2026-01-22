import { apiConnector } from "../apiConnector"
import { categoriesEndpoints } from "../apis"
import { toast } from "react-hot-toast"

const { GET_ALL_CATEGORIES_API } = categoriesEndpoints

export const fetchCourseCategories = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_CATEGORIES_API)

    if (!response?.data?.success) {
      throw new Error("Failed to fetch categories")
    }

    return response.data.data
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Could not load categories"
    )
    return []
  }
}