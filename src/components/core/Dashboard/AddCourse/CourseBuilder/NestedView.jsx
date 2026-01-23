import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useSelector } from "react-redux"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  
  const [addSubSection, setAddSubsection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Handle nested data safely
  const courseData = course?.data || course; 
  const courseContent = courseData?.courseContent || [];

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8 mt-10">
        {courseContent.map((section) => (
          <details key={section._id} open>
            <summary className="flex items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu />
                <p className="font-semibold text-richblack-50">{section.sectionName}</p>
              </div>
              <div className="flex items-center gap-x-3 text-richblack-300">
                <button 
                  onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>
                <button 
                  onClick={() => setConfirmationModal({ 
                    text1: "Delete Section?", 
                    text2: "All the lectures in this section will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => { /* Add delete logic if needed later */ }, 
                    btn2Handler: () => setConfirmationModal(null) 
                  })}
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className="text-xl text-richblack-300" />
              </div>
            </summary>
            <div className="px-6 pb-4">
              {section.subSection?.map((data) => (
                <div key={data._id} className="flex items-center justify-between border-b-2 border-b-richblack-600 py-2">
                  <div className="flex items-center gap-x-3 py-2">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">{data.title}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setAddSubsection(section._id)} 
                className="mt-3 flex items-center gap-x-1 text-yellow-50 font-bold"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {addSubSection && (
        <SubSectionModal 
          modalData={addSubSection} 
          setModalData={setAddSubsection} 
          add={true} 
        />
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}