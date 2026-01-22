import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../../services/operations/profileAPI"
import InstructorChart from "./InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState([]) // ✅ always array
  const [courses, setCourses] = useState([])               // ✅ always array

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const instructorApiData = await getInstructorData(token)
        const coursesData = await fetchInstructorCourses(token)

        // ✅ SAFE ASSIGNMENTS
        setInstructorData(Array.isArray(instructorApiData) ? instructorApiData : [])
        setCourses(Array.isArray(coursesData) ? coursesData : [])
      } catch (error) {
        console.error("Instructor dashboard error:", error)
        setInstructorData([])
        setCourses([])
      }
      setLoading(false)
    }

    fetchData()
  }, [token])

  // ✅ SAFE REDUCE (never crashes)
  const totalAmount = instructorData.reduce(
    (acc, curr) => acc + (curr.totalAmountGenerated || 0),
    0
  )

  const totalStudents = instructorData.reduce(
    (acc, curr) => acc + (curr.totalStudentsEnrolled || 0),
    0
  )

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName || "Instructor"} 👋
        </h1>
        <p className="text-richblack-200">Let's start something new</p>
      </div>

      {courses.length > 0 ? (
        <>
          {/* CHART + STATS */}
          <div className="flex flex-col lg:flex-row gap-4 h-[450px]">
            {(totalAmount > 0 || totalStudents > 0) ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-richblack-50">
                  Not enough data to visualize
                </p>
              </div>
            )}

            <div className="min-w-[250px] rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    ₹ {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COURSES LIST */}
          <div className="rounded-md bg-richblack-800 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link
                to="/dashboard/my-courses"
                className="text-yellow-50 text-sm font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="mt-4 flex gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-1/3">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[200px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3">
                    <p className="text-sm font-medium text-richblack-50">
                      {course.courseName}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-richblack-300">
                      {/* ✅ FINAL SAFE FIX */}
                      <span>
                        {course.studentsEnrolled?.length || course.studentsEnroled?.length || 0} students
                      </span>
                      <span>|</span>
                      <span>₹ {course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* NO COURSES */
        <div className="rounded-md bg-richblack-800 p-10 text-center">
          <p className="text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link
            to="/dashboard/add-course"
            className="mt-2 inline-block text-lg font-semibold text-yellow-50"
          >
            Create a course
          </Link>
        </div>
      )}
    </div>
  )
}
