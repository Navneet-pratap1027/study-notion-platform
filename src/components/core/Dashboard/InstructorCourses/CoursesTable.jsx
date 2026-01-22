import { useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const TRUNCATE_LENGTH = 30

  // ================= DELETE COURSE =================
  const handleCourseDelete = async (courseId) => {
    setLoading(true)

    const res = await deleteCourse(courseId, token)

    if (res?.success) {
      const result = await fetchInstructorCourses(token)
      if (result) setCourses(result)
    }

    setLoading(false)
    setConfirmationModal(null)
  }

  return (
    <>
      <Table className="rounded-xl border border-richblack-800">
        <Thead>
          <Tr className="flex gap-x-10 border-b border-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium text-richblack-100">
              Courses
            </Th>
            <Th className="text-sm font-medium text-richblack-100">
              Duration
            </Th>
            <Th className="text-sm font-medium text-richblack-100">
              Price
            </Th>
            <Th className="text-sm font-medium text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl text-richblack-100">
                No courses found
              </Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course.courseName}
                    </p>

                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>

                    <p className="text-xs text-white">
                      Created: {formatDate(course.createdAt)}
                    </p>

                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-xs text-pink-100">
                        <HiClock size={14} /> Drafted
                      </p>
                    ) : (
                      <p className="flex items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-xs text-yellow-100">
                        <FaCheck size={10} /> Published
                      </p>
                    )}
                  </div>
                </Td>

                <Td className="text-sm text-richblack-100">2hr 30min</Td>
                <Td className="text-sm text-richblack-100">
                  ₹{course.price}
                </Td>

                <Td className="text-sm text-richblack-100">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }
                    className="px-2 hover:text-green-300"
                  >
                    <FiEdit2 size={20} />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this course?",
                        text2:
                          "All sections, lectures and data will be removed",

                        btn1Text: "Cancel",
                        btn2Text: "Delete",

                        btn1Handler: () =>
                          setConfirmationModal(null),
                        btn2Handler: () =>
                          handleCourseDelete(course._id),
                      })
                    }
                    className="px-2 hover:text-red-500"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}
