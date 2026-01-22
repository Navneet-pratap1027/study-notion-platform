import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

function Catalog() {
  const { catalogName } = useParams()
  const navigate = useNavigate()

  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true) // Reset loading on catalog change
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/course/getCategoryPageDetails/${catalogName}`
        )
        // Ensure we are targeting the right data path from your backend response
        setCategory(res.data.data?.selectedCategory || res.data.data)
      } catch (err) {
        console.error("Error fetching category:", err)
        setCategory(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [catalogName])

  if (loading) {
    return <div style={{ color: "white", padding: "20px" }}>Loading...</div>
  }

  if (!category) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        <h1>No category found</h1>
        <p>Please check if the category slug is correct in the database.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        {category?.name}
      </h1>

      <p style={{ marginBottom: "30px", color: "#aaa" }}>
        {category?.description}
      </p>

      {/* ✅ FIX: Added optional chaining (?.) to prevent 'length' error */}
      {(!category?.courses || category?.courses?.length === 0) ? (
        <div style={{ padding: "20px", background: "#161d29", borderRadius: "8px" }}>
          <p>No courses available for this category yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {category.courses.map((course) => (
            <div
              key={course._id}
              style={{
                background: "#161d29",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #424854"
              }}
            >
              <img
                src={course?.thumbnail}
                alt={course?.courseName}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />

              <div style={{ padding: "15px" }}>
                <h3 style={{ color: "#f1f2ff" }}>{course?.courseName}</h3>
                <p style={{ fontSize: "14px", color: "#99daff", margin: "5px 0" }}>
                  {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
                <p style={{ fontSize: "14px", color: "#ccc", height: "40px", overflow: "hidden" }}>
                  {course?.courseDescription}
                </p>

                <p style={{ marginTop: "10px", color: "#ffd60a", fontWeight: "bold", fontSize: "20px" }}>
                  ₹ {course?.price}
                </p>

                <button
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: "#ffd60a",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    color: "#000814"
                  }}
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Catalog