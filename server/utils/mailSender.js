const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    /* 🔥 SMTP VERIFY — SABSE IMPORTANT */
    transporter.verify((error, success) => {
      if (error) {
        console.log("SMTP VERIFY ERROR:", error);
      } else {
        console.log("SMTP READY");
      }
    });

    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("MAIL SENT ", info.response);
    return info;
  } catch (error) {
    console.error("MAIL ERROR ", error);
    throw error;
  }
};

module.exports = mailSender;

/* const nodemailer = require("nodemailer");

 ✅ transporter ek hi baar banega 
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true ONLY for port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

🔥 SMTP VERIFY — SABSE IMPORTANT 
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

 ✅ Actual mail sender 
const mailSender = async (email, title, body) => {
  try {
    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("MAIL SENT:", info.response);
    return info;
  } catch (error) {
    console.error("MAIL SEND ERROR:", error);
    throw error;
  }
};

module.exports = mailSender; */
