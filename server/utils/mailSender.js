const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    // Transporter configuration for Gmail
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, 
      port: Number(process.env.MAIL_PORT), 
      secure: true, 
      auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
      },
    });

    // Sending the email
    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`, // Sender address
      to: `${email}`, 
      subject: `${title}`, 
      html: `${body}`, 
    });

    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log("Error occurred while sending email: ", error.message);
    throw error;
  }
};

module.exports = mailSender;