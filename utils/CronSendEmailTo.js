let cron = require("node-cron");
const transporter = require("./EmailGenerator").transporter;

function sendEmailSignup(email) {
  var msgs = [
    "Welcome to Blog Application. Now you can explore all the features ",
    "You can add blogs",
    "You can update blogs",
  ];
  var len1 = msgs.length;
  var i = 0;
  const task = cron.schedule("0 * * * * * ", function () {
    const mailOptions = {
      from: "vibranode@outlook.com",
      to: email,
      subject: "Welcome msg 2",
      text: msgs[i],
    };

    if (i < len1) {
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        i = i + 1;
        console.log("Sent: " + info.response);
      });
    } else {
      task.stop();
      console.log("stop");
    }
  });

  console.log("cron ended");
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
          console.log(err);
          return;
        }
        console.log("Sent: " + info.response);
      });
    });
  });
}

module.exports = { sendEmailSignup, sendEmailPassword };
