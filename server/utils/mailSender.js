const nodemailer = require("nodemailer");

exports.mailSender = async (email, title, body) => {
  try {
    const configuredPort = Number(process.env.MAIL_PORT);
    const mailPorts = Number.isFinite(configuredPort)
      ? [configuredPort]
      : [587, 465, 2525];

    let lastError;

    for (const mailPort of mailPorts) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: mailPort,
          secure: mailPort === 465,
          requireTLS: mailPort !== 465,
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
        lastError = error;
        if (!["ETIMEDOUT", "ESOCKET", "ECONNREFUSED"].includes(error.code)) {
          throw error;
        }
      }
    }

    throw lastError;
  } catch (error) {
    console.log("Mail Error:", error);
    throw error;
  }
};