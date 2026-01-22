const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")

const database = require("./config/database")
const { cloudinaryConnect } = require("./config/cloudinary")

// ROUTES
const userRoutes = require("./routes/User")
const profileRoutes = require("./routes/Profile")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payments")
const contactRoutes = require("./routes/Contact")
const categoryRoutes = require("./routes/Category") // ✅ GOOD

dotenv.config()
const PORT = process.env.PORT || 4000

// DB
database.connect()

// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
)

// CLOUDINARY
cloudinaryConnect()

// ROUTES MOUNTING
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/reach", contactRoutes)
app.use("/api/v1/category", categoryRoutes)

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server running" })
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})