let cron = require("node-cron");
const transporter = require("./EmailGenerator").transporter;
const logger=require('./logger')
require("dotenv").config();

function sendEmailSignup(email) {
  var msg ="Welcome to Blog Application. Now you can explore all the features ";
  const mailOptions = {
    from: process.env.SEND_EMAIL,
    to: email,
    subject: "Welcome msg ",
    text: msg,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      logger.customLogger.log("error", "Error: " + err);
      console.log(err);
      return;
    } else {
      logger.customLogger.log("info", "Email successfully sent: " + info);
    }
  });
}

function sendEmailPassword(emails) {
  cron.schedule("03 17 * * * ", function () {
    emails.map((email) => {
      const mailOptions = {
        from: "vibranode@outlook.com",
        to: email,
        subject: "PassWord Warning",
        text: "Kindly change your password for security reasons. It has been a month since the last change",
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          logger.customLogger.log('error',"Error: "+err)
          return;
        }
        else{
          logger.customLogger.log("Email successfully sent: ",info)
        }
      });
    });
  });
}

module.exports = { sendEmailSignup, sendEmailPassword };
