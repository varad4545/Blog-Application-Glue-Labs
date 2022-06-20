const express = require("express");
const users = require("../models").users;
const blog = require("../models").blogposts;
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const logger = require("../../utils/logger");
const {
  authToken,
} = require("../middlewares/authmiddlewares");
const {
  userSchemaValidator,blogSchemaValidator
} = require("../middlewares/JoiValidatemiddleware");
const { sendEmailSignup, reminder } = require("../../utils/CronSendEmailTo");
const { mailqueue } = require("../../utils/BullQueue");
const redisClient = require("../../utils/redisClient.js");
require("dotenv").config();
require("../auth/passport");
const swaggerJsDocs = require("swagger-jsdoc");
const Bull = require("bull");
const DEFAULT_EXPIRATION = 3600;

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: "8h" });
}

//Home
router.get("/homepage", (req, res) => {
  res.status(200).send("Welcome to Blog App. Kindly register or Login");
});

//register
router.post("/register", userSchemaValidator, async (req, res) => {
  const { email, password, role } = req.body;
  try
  {
    if (!email || !password || !role)
    {
      return res.status(400).send("Please enter all fields");
    } 
    await users.findOne({ where: { email } })
      .then(async (ExistUser) => {
        if (ExistUser) {
          return res.json({ message: "User with email already exist " });
        }

        await users.create({
          email,
          password,
          role,
        })
        .then(async (value) => {
          mailqueue(email);
          getusers = await users.findAll({ where: { role: "basic" } });
          redisClient.setEx("usersforAdmin",DEFAULT_EXPIRATION,JSON.stringify(getusers));
          res.status(200).send(`Successfully Registered`);
        });
      });
  }
  catch (err)
  {
    logger.customLogger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

//refreshToken
router.get("/refreshToken/:id", async (req, res) => {
  const id = req.params.id;
  const user_data = await users.findOne({ where: { id: id } });

  if (user_data == null) return res.sendStatus(401);
  if (!user_data.refreshtoken) return res.sendStatus(403);

  jwt.verify(user_data.refreshtoken,process.env.REFRESH_TOKEN_KEY,(err, user) =>{
    if (err) res.sendStatus(403);
    const accessToken = generateAccessToken({ email: user.email });
    res.json({ accessToken: accessToken });
  }
  );

});

//login
router.post("/login", userSchemaValidator, async (req, res) => {
  const { email, password } = req.body;
  try
  {
    await users.findOne({ where: { email } })
      .then(async(userWithEmail)=>{
        if (await bcrypt.compare(password, userWithEmail.password))
        {
          const user = { email: userWithEmail.email };
          const accessToken = generateAccessToken(user);
          const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_KEY, {expiresIn: "7d",});
    
          await users.update({
              refreshtoken: refreshToken,
            },{ where: { id: userWithEmail.id } }
          );
          
          res.status(200).json({
            message: `Welcome Back`,
            AccessToken: accessToken,
            RefreshToken: refreshToken,
          });
        }
        else
        {
          res.status(403).send("Email or Password does not match");
        }
      })
  }
  catch(err)
  {
    logger.customLogger.log("error", "Error: ", err);
    res.status(500).send(err);
  }
});

//changepassword
router.post("/changepassword", userSchemaValidator, async (req, res) => {
  const body = req.body;
  const locateEntry = await users.findOne({ where: { email: body.email } });
  const getEntry = locateEntry.toJSON();
  const oldpassword = getEntry.password;

  if (await bcrypt.compare(body.oldpassword, oldpassword))
  {
    const hashedPassword = await bcrypt.hash(body.newpassword, 10);
    users
      .update(
        {
          password: hashedPassword,
        },
        { where: { id: getEntry.id } }
      )
      .then((value) => {
        res.status(200).send("Password Updated");
      })
      .catch((error) => {
        logger.customLogger.log("error", "Error: " + err);
      });
  }
  else
  {
    res.status(400).send("Enter the old password correctly");
  }
});

//logout
router.put("/logout/:id", authToken, async (req, res) => {
  const user = await users.findOne({ where: { id: req.params.id } });
  if (user.refreshtoken) {
    users.update({ refreshtoken: null }, { where: { id: req.params.id } });
  }
  res.status(200).send("Logged out");
});


//feedback mail- store emails in redis cache(from queue), reminder mail- cron schedule mails(midnight-from queue)
router.get("/feedback/reminder", async (req, res) => {
  let AllEmails = await users.findAll({
    attributes: ["email"],
    where: { role: "basic" },
  });

  AllEmails = JSON.stringify(AllEmails);
  AllEmails = JSON.parse(AllEmails);

  let listEmails = [];
  AllEmails.map((user) => {
    listEmails.push(user["email"]);
  });
  const EmailQueue = new Bull("email-queue");

  listEmails.map((email) => {
    const data = {
      Email: email,
    };
    const options = {
      delay: 60000,
    };
    EmailQueue.add(data, options);
  });

  EmailQueue.process(async (job) => {
    let sub = "User Experience Feedback";
    let msg ="You are requested to fill the feedback form as soon a possible. It will help us to provide a better service ";
    await sendEmailSignup(job.data.Email, sub, msg);
    return await reminder(job.data.Email);
  });
  res.status(200).send("Succesfully sent")
});

module.exports = router;
