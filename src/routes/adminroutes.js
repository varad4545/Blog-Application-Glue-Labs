const express = require("express");
const users = require("../models").users;
const blog = require("../models").blogposts;
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {authRole,authToken} = require("../middlewares/authmiddlewares");
const {userSchemaValidator,blogSchemaValidator} = require("../middlewares/JoiValidatemiddleware");
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
router.get("/admin/getusers/:id",authRole('admin'),authToken,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    try
    {
      let data = await redisClient.get("usersforAdmin");
      if(data)
      {
        return res.json(JSON.parse(data));
      }
      else
      {
        await users.findAll({ where:{ 
          role: "basic" 
        }})
        .then((user) => {
          redisClient.setEx("usersforAdmin",DEFAULT_EXPIRATION,JSON.stringify(user));
          res.status(200).send(user);
        })
      }
    }
    catch(err)
    {
      logger.customLogger.log('error','Error: ',err)
      res.status(500).send(err);
    }
  }
);

//get all blogs
router.get("/admin/getblogs/:id",authRole('admin'),authToken,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    try
    {
      let data = await redisClient.get("blogsforAdmin");
      if (data)
      {
        return res.json(JSON.parse(data));
      }
      else
      {
        await blog.findAll()
        .then((user) => {
          redisClient.setEx("blogsforAdmin",DEFAULT_EXPIRATION,JSON.stringify(user));
          res.status(200).send(user);
        })
      }
    }
    catch(err)
    {
      logger.customLogger.log('error','Error: ',err)
      res.status(500).send(err);
    }
  }
);

//delete individual users
router.delete("/admin/deleteusers/:id",authRole('admin'),authToken,userSchemaValidator,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    try
    {
      const delete_id = req.body.id;
      await users.findOne({ where: { id: delete_id, role: "basic" }})
        .then(async (user) => {
          if (!user)
          {
            return res.status(404).send("No User Found");
          }
  
          blog.findOne({ where: { userId: delete_id } })
            .then(async (blogData) => {
              if (!blogData)
              {
                users.destroy({ where: { id: delete_id } }).then((value) => {
                  return res.status(200).send(`User Deleted`);
                });
              }
              else
              {
                blog.destroy({ where: { userId: delete_id } }).then(() => {
                  users.destroy({ where: { id: delete_id } }).then((value) => {
                    return res.status(200).send(`User Deleted`);
                  });
                });
              }

            });
        });
    }
    catch(err)
    {
        logger.customLogger.log("error", "Error: ", err);
        res.status(500).send(err);
    }
  }
);

//update individual users
router.put(
  "/admin/updateusers/:id",authRole('admin'),authToken,userSchemaValidator,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    try
    {
      const user_id = req.body.id;
      await users.findOne({ where: { id: user_id, role: 'basic' } })
      .then( async (finduser)=>{
        if(!finduser){
          return res.sendStatus(404);
        }
        
        const data = {
          email: req.body.email,  
        };
  
        await users.update(data, { where: { id: user_id } })
        .then((value) => {
          res.status(200).send(`Updated User`)
        })
      })
    }
    catch(err)
    {
      logger.customLogger.log('error','Error: ',err)
      res.status(500).send(err);
    }
  }
);

//Periodic password change warning
router.get("/admin/PasswordWarning/:id",authRole('admin'),rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    let allusers = await users.findAll({ where: { role: "basic" }});
    allusers = JSON.stringify(allusers);
    allusers = JSON.parse(allusers);
    const emails = [];

    allusers.map((user) => {
      emails.push(user.email);
    });

    if (allusers)
    {
      sendEmailPassword(emails);
    }else
    {
      res.status(200).send("No basic users found");
    }
  }
);

module.exports = router;
