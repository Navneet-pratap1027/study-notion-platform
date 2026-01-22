import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload" // folder structure 

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [view, edit, modalData, setValue])

  // Form submit check karne ke liye helper function
  const isFormUpdated = () => {
    const currentValues = getValues()
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true
    }
    return false
  }

  const onSubmit = async (data) => {
    console.log("Submit button clicked, Form Data:", data) // Debugging log

    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        // Handle Edit SubSection logic here if needed
        return
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData) // modalData holds the sectionId in 'add' mode
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc || "") // Default empty string if not provided
    formData.append("video", data.lectureVideo)

    setLoading(true)
    try {
      const result = await createSubSection(formData, token)
      if (result) {
        // Redux update logic: Aapke console ke hisaab se poora response save ho raha hai
        dispatch(setCourse(result))
        setModalData(null)
        toast.success("Lecture added successfully")
      }
    } catch (error) {
      console.error("API Error:", error)
      toast.error("Failed to add lecture")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view ? "Viewing" : add ? "Adding" : edit ? "Editing" : ""} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          {/* Video Upload Component */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}/>
          
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              id="lectureTitle"
              disabled={view || loading}
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full bg-richblack-700 p-3 text-white rounded-md"
            />
            {errors.lectureTitle && (
              <span className="text-xs text-pink-200">Lecture title is required</span>
            )}
          </div>

          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              id="lectureDesc"
              disabled={view || loading}
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style min-h-[130px] w-full bg-richblack-700 p-3 text-white rounded-md"
            />
            {errors.lectureDesc && (
              <span className="text-xs text-pink-200">Lecture description is required</span>
            )}
          </div>

          {/* Action Button */}
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading..." : add ? "Save" : "Save Changes"}
                type="submit" // Ensure type is submit
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}