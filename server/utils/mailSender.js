const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    console.log("Creating transporter...");

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      family: 4,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log("Transporter created");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail Sent", info);

    return info;
  } catch (err) {
    console.error("Mail Error:", err);
    throw err;
  }
};

module.exports = mailSender;