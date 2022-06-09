const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "vibranode@outlook.com",
    pass: "vibra2090vano",
  },
});

module.exports = {
  transporter,
};
