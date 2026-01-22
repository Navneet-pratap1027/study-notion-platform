import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [addSubSection, setAddSubsection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const courseData = course?.data || course; // ✅ Handle nested data
  const courseContent = courseData?.courseContent || [];

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8 mt-10">
        {courseContent.map((section) => (
          <details key={section._id} open>
            <summary className="flex items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3"><RxDropdownMenu /><p>{section.sectionName}</p></div>
              <div className="flex items-center gap-x-3">
                <button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}><MdEdit /></button>
                <button onClick={() => setConfirmationModal({ text1: "Delete Section?", btn1Handler: () => {}, btn2Handler: () => setConfirmationModal(null) })}><RiDeleteBin6Line /></button>
                <AiFillCaretDown />
              </div>
            </summary>
            <div className="px-6 pb-4">
              {section.subSection?.map((data) => (
                <div key={data._id} className="flex items-center justify-between border-b-2 py-2">
                  <p>{data.title}</p>
                </div>
              ))}
              <button onClick={() => setAddSubsection(section._id)} className="mt-3 flex items-center gap-x-1 text-yellow-50">
                <FaPlus /><p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {addSubSection && <SubSectionModal modalData={addSubSection} setModalData={setAddSubsection} add={true} />}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}