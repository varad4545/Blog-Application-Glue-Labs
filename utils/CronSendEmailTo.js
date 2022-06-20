let cron = require("node-cron");
const transporter = require("./EmailGenerator").transporter;
const logger=require('./logger')
const redisClient=require('./redisClient')
require("dotenv").config();
const DEFAULT_EXPIRATION = 3600;

//Sends email to users
async function sendEmailSignup(email,sub,msg) {
  const mailOptions = {
    from: process.env.SEND_EMAIL,
    to: email,
    subject:sub,
    text: msg,
  };
  let emailcache = await redisClient.get("emailist");
  emailList=[]
  transporter.sendMail(mailOptions, async function (err, info) {
    if (err) {
      logger.customLogger.log("error", "Error: " + err);
      return;
    } else {
      emailList.push(email)
      redisClient.setEx("emailist",DEFAULT_EXPIRATION,JSON.stringify(emailList));
      logger.customLogger.log("info", "Email successfully sent: " + info);
    }
  });
}

//Cron for password change email every month
function sendEmailPassword(emails) {
  cron.schedule("08 17 * * * ", function () {
    emails.map((email) => {
      const mailOptions = {
        from:process.env.SEND_EMAIL,
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

//Cron for remoinder at midnight
function reminder(email) {
  cron.schedule("0 0 * * *", function () {
    const mailOptions = {
      from: process.env.SEND_EMAIL,
      to: email,
      subject: "Reminder",
      text: "Check new stories on home page",
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        logger.customLogger.log("error", "Error: " + err);
        return;
      } else {
        logger.customLogger.log("Email successfully sent: ", info);
      }
    });
  });
}

module.exports = { sendEmailSignup, sendEmailPassword,reminder };
