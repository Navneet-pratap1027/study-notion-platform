import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../common/IconBtn"
import ConfirmationModal from "../../common/ConfirmationModal"
import CoursesTable from "./InstructorCourses/CoursesTable"

import {
  fetchInstructorCourses,
  deleteCourse,
} from "../../../services/operations/courseDetailsAPI"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [confirmationModal, setConfirmationModal] = useState(null)

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
    }

    fetchCourses()
  }, [token])

  return (
    <div className="px-8">
      {/* HEADER */}
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">
          My Courses
        </h1>

        <IconBtn
          text="Add Course"
          onClick={() => navigate("/dashboard/add-course")}
        />
      </div>

      {/* COURSES TABLE */}
      {courses && (
        <CoursesTable
  courses={courses}
  setCourses={setCourses}
/>

      )}

      {/* CONFIRMATION MODAL */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}