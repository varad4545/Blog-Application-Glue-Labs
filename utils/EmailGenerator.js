const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.SEND_EMAIL,
    pass: process.env.SEND_PASSWORD,
  },
});

module.exports = {
  transporter,
};
