const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.BREVO_SMTP_USER, // always "apikey"
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log(err?.message);
  }
};

module.exports = sendEmail;
