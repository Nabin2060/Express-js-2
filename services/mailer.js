const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async ({ email, subject, htmlMsg }) => {
  const { messageID } = await transporter.sendMail({
    from: '"nabin" <adhikarinabin20@gmail.com>', //sender address
    to: email,
    subject,
    html: htmlMsg,
  });
  return messageID;
};

module.exports = { sendMail };
