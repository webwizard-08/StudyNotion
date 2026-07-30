const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  family: 4, // Force IPv4
});
await transporter.verify();
console.log("SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: `StudyNotion <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail sent successfully", info);

    return info;   // ✅ Ye line add karo
  } catch (error) {
    console.log("Error in mailSender", error);
    throw error;   // ✅ Error bhi propagate karo
  }
};

module.exports = mailSender;