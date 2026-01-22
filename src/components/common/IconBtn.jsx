export default function IconBtn({
  text,
  onClick,
  children,
  disabled = false,
  outline = false,
  customClasses = "",
  type = "submit", // 👈 "button" ko badal kar "submit" karein
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-x-2 rounded-md py-2 px-5 font-semibold
        ${
          outline
            ? "border border-yellow-50 bg-transparent text-yellow-50"
            : "bg-yellow-50 text-richblack-900"
        }
        ${customClasses}`
      }
    >
      {children ? (
        <>
          <span className={`${outline ? "text-yellow-50" : "text-richblack-900"}`}>
            {text}
          </span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}