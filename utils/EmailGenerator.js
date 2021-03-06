const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.SEND_EMAIL,
    pass: process.env.SEND_PASSWORD,
  },
});

module.exports = {
  transporter,
};
