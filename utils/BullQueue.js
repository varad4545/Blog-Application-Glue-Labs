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
    let sub="Welcom Message"
    let msg ="Welcome to Blog Application. Now you can explore all the features ";
    return await sendEmailSignup(job.data.Email,sub,msg);
  });
}

module.exports = { mailqueue };
