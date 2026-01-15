require("dotenv").config();
const mailSender = require("./utils/mailSender");

(async () => {
  try {
    await mailSender(
      "pratap.tech2710@gmail.com",   // apna hi email daalo
      "StudyNotion Test Mail",
      "<h2>If you received this mail, mail system works ✅</h2>"
    );
    console.log("✅ TEST MAIL SENT SUCCESSFULLY");
  } catch (error) {
    console.error("❌ TEST MAIL FAILED", error);
  }
})();