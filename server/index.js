const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Load env
dotenv.config();

// Import configs
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactRoutes = require("./routes/Contact");
const categoryRoutes = require("./routes/Category");

// Init app
const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// ================= Middleware =================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ================= DB + Cloud =================

database.connect();
cloudinaryConnect();

// ================= Routes =================

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);
app.use("/api/v1/category", categoryRoutes);

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Server running successfully",
  });
});

// ================= Start Server =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});