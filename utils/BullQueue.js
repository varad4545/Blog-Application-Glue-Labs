const { sendEmailSignup } = require("./CronSendEmailTo");
const Bull = require("bull");

function mailqueue(email) {
  const sendQueue = new Bull("first-queue");
  const data = {
    Email: email,
  };
  const options = {
    delay: 60000,
    attempts: 2,
  };
  sendQueue.add(data, options);
  sendQueue.process(async (job) => {
    console.log("sent mail yo");
    console.log(sendQueue);
    return await sendEmailSignup(job.data.Email);
  });
}

module.exports = { mailqueue };
