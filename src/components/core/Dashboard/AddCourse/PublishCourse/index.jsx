import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  //  Sahi data nikalne ke liye logic
  const courseData = course?.data || course;
  useEffect(() => {
    if (courseData?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [courseData, setValue])
  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }
  const handleCoursePublish = async () => {
    // Check if status changed
    const isAlreadyPublished = courseData?.status === COURSE_STATUS.PUBLISHED
    const isChecked = getValues("public")
    if ((isAlreadyPublished && isChecked === true) || 
        (courseData?.status === COURSE_STATUS.DRAFT && isChecked === false)) {
      goToCourses()
      return
    }
    const formData = new FormData()
    formData.append("courseId", courseData._id)
    const courseStatus = isChecked ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)

    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }

  return (
    <div className="rounded-md border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>
      <form onSubmit={handleSubmit(handleCoursePublish)}>
        <div className="my-6">
          <label htmlFor="public" className="inline-flex items-center text-lg cursor-pointer">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-4 w-4 cursor-pointer rounded bg-richblack-500"
            />
            <span className="ml-2 text-richblack-400">Make this course as public</span>
          </label>
        </div>
        <div className="flex justify-end gap-x-3">
          <button type="button" onClick={() => dispatch(setStep(2))} className="bg-richblack-300 px-5 py-2 rounded-md text-richblack-900">
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  )
}