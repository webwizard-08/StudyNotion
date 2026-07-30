const nodemailer = require("nodemailer");

exports.mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
    console.log("Before verify");
await transporter.verify();
console.log("SMTP Verified");

console.log("Before sendMail");

const info = await transporter.sendMail({
  from: `"StudyNotion" <${process.env.MAIL_USER}>`,
  to: email,
  subject: title,
  html: body,
});

console.log("After sendMail");
console.log(info);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Mail Error:", error);
    throw error;
  }
};