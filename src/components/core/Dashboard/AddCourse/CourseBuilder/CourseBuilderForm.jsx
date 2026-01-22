import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const dispatch = useDispatch()
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [editSectionId, setEditSectionId] = useState(null)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const courseId = course?.data?._id || course?._id; // ✅ Fixed Syntax
    if (!courseId) { alert("Course not found"); return; }

    setLoading(true)
    let result = editSectionId 
      ? await updateSection({ sectionName: data.sectionName, sectionId: editSectionId, courseId }, token)
      : await createSection({ sectionName: data.sectionName, courseId }, token);

    if (result) {
      dispatch(setCourse(result))
      setEditSectionId(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  const goToNext = () => {
    const content = course?.data?.courseContent || course?.courseContent; // ✅ Fixed Syntax
    if (!content || content.length === 0) { alert("Please add at least one section"); return; }
    dispatch(setStep(3))
  }

  return (
    <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("sectionName", { required: true })} className="form-style w-full bg-richblack-700 p-3 text-white rounded-md" placeholder="Add a section" />
        <IconBtn type="submit" disabled={loading} text={editSectionId ? "Update Section" : "Create Section"} outline><IoAddCircleOutline /></IconBtn>
      </form>
      {(course?.data?.courseContent?.length > 0 || course?.courseContent?.length > 0) && (
        <NestedView handleChangeEditSectionName={(id, name) => { setEditSectionId(id); setValue("sectionName", name); }} />
      )}
      <div className="flex justify-end gap-x-3">
        <button onClick={() => dispatch(setStep(1))} className="rounded-md bg-richblack-300 px-6 py-2 text-richblack-900">Back</button>
        <IconBtn text="Next" onClick={goToNext}><MdNavigateNext /></IconBtn>
      </div>
    </div>
  )
}