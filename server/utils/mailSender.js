const nodemailer = require("nodemailer");

exports.mailSender = async (email, title, body) => {
  try {
    const mailPort = Number(process.env.MAIL_PORT) || 587;
    const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: mailPort,
  secure: mailPort === 465,
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
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