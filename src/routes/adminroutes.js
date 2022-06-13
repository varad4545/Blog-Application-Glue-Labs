const express = require("express");
const users = require("../models").users;
const blog = require("../models").blogposts;
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {authAdminAccess,authToken} = require("../middlewares/authmiddlewares");
const {validateDeleteuserAdmin,validateUpdateuserAdmin} = require("../middlewares/JoiValidatemiddleware");
const {rateLimiter}=require('../../utils/RateLimiter')
const logger = require("../../utils/logger");
const {sendEmailPassword}=require("../../utils/CronSendEmailTo")
require("dotenv").config();
require("../auth/passport");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDocs = require("swagger-jsdoc");
const redisClient = require("../../utils/redisClient.js");
const DEFAULT_EXPIRATION = 3600;

//get all users
router.get("/admin/getusers/:id",authAdminAccess(),authToken,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    let getCacheData = await redisClient.get("usersforAdmin");
    if (getCacheData) {
      console.log("Cache Hit");
      return res.status(200).send({
        response: JSON.parse(getCacheData),
        callsInMinute: req.requests,
        ttl:req.ttl
      });
    } else {
      console.log("Cache Miss");
      const getusers = await users.findAll({ where: { role: "basic" } });
      if (getusers) {
        redisClient.setEx(
          "usersforAdmin",
          DEFAULT_EXPIRATION,
          JSON.stringify(getusers)
        );
        res.status(200).send({
          response:getusers,
          callsInMinute: req.requests,
          ttl:req.ttl
        });
      } else {
        res.status(400).send("No users");
      }
    }
  }
);

//get all blogs
router.get("/admin/getblogs/:id",authAdminAccess(),authToken,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    let getCacheData = await redisClient.get("blogsforAdmin");
    if (getCacheData) {
      console.log("Cache Hit");
      return res.json(JSON.parse(getCacheData));
    } else {
      console.log("Cache Miss");
      const getusers = await blog.findAll();
      if (getusers) {
        redisClient.setEx(
          "blogsforAdmin",
          DEFAULT_EXPIRATION,
          JSON.stringify(getusers)
        );
        res.status(200).send(getusers);
      } else {
        res.status(400).send("No Blogs");
      }
    }
  }
);

//delete individual users
router.delete("/admin/deleteusers/:id",authAdminAccess(),authToken,validateDeleteuserAdmin,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    const deleteid = req.body.id;
    var finduser = await users.findOne({ where: { id: deleteid } });
    if (finduser) {
      finduser = finduser.toJSON();
      if (finduser.role === "admin") {
        res.send("Other Admins cannot be deleted");
      } else {
        users
          .destroy({ where: { id: deleteid } })
          .then((data) => {
            blog.destroy({ where: { id: deleteid } });
            res.status(200).send("User deleted");
          })
          .catch((err) => {
            res.status(400).send("Error: ", err);
          });
      }
    } else {
      res.status(400).send("User not found");
    }
  }
);

//update individual users
router.put(
  "/admin/updateusers/:id",authAdminAccess(),authToken,validateUpdateuserAdmin,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    updateid = req.body.id;
    var finduser = await users.findOne({ where: { id: updateid } });
    if (finduser) {
      finduser = finduser.toJSON();
      if (finduser.role === "admin") {
        res.status(403).send("Other Admins cannot be updated");
      } else {
        const updatedData = {
          id: updateid,
          email: req.body.email,
        };
        users
          .update(updatedData, { where: { id: updateid } })
          .then((data) => {
            blog.update(updatedData, { where: { id: updateid } });
            res.status(200).send("Updated User data");
          })
          .catch((err) => {
            res.status(400).send("Error: ", err);
          });
      }
    } else {
      res.status(400).send("User not found");
    }
  }
);

//Periodic password change warning
router.get("/admin/PasswordWarning/:id",authAdminAccess(),rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    let allusers = await users.findAll({ where: { role: "basic" } });
    allusers = JSON.stringify(allusers);
    allusers = JSON.parse(allusers);
    const emails = [];
    allusers.map((user) => {
      emails.push(user.email);
    });
    if (allusers) {
      sendEmailPassword(emails);
    } else {
      res.status(200).send("No basic users found");
    }
  }
);

module.exports = router;
