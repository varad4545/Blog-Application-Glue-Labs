const express = require("express");
const users = require("../models").users;
const blog = require("../models").blogposts;
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const logger=require('../../utils/logger')
const {authToken,authRole} = require("../middlewares/authmiddlewares");
const {userSchemaValidator,blogSchemaValidator}=require("../middlewares/JoiValidatemiddleware")
const {rateLimiter}=require('../../utils/RateLimiter')
require("dotenv").config();
require("../auth/passport");
const redisClient=require('../../utils/redisClient.js')
const DEFAULT_EXPIRATION=3600

//get individual blogs
router.get("/basic/getblog/:id",authRole('basic'), authToken,rateLimiter({secondsWindow:60,allowedHits:5}), async (req, res) => {
  try
  {
    let data = await redisClient.get('blog');
    if(data)
    {
      return res.json(data)
    }
    else
    {
      await blog.findOne({ where: { 
        userId: req.params.id, 
        title: req.body.title 
      }})
      .then((data)=>{
        redisClient.setEx('blog', DEFAULT_EXPIRATION,data.post)
        res.status(200).send(data.post);
      })
    }
  }
  catch(err)
  {
    logger.customLogger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

//get all blogs of a user
router.get("/basic/getallblogs/:id",authRole('basic'),authToken,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
    try
    {
      let data = await redisClient.get('blogs');
      if(data)
      {
        return res.json(JSON.parse(data))
      }
      else
      {
        await blog.findAll({ where: { 
          userId: req.params.id, 
        }})
        .then((data)=>{
            let allPosts = []
            data.map((item)=>{
            let postData = {
            id: item.id,
            title: item.title,
            post: item.post
          }
          allPosts.push(postData);
          })
         redisClient.setEx('blogs', DEFAULT_EXPIRATION,JSON.stringify(allPosts))
         res.status(200).send(allPosts);
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

//post blogs
router.post("/basic/postblog/:id",authRole('basic'),authToken,blogSchemaValidator,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
  try
  {
    const id = req.params.id;
    const title = req.body.title;
    const post = req.body.post;

    await blog.create({
      userId: id,
      title,
      post
    })
    .then((data)=>{
      redisClient.setEx('blogsforAdmin', DEFAULT_EXPIRATION,JSON.stringify(data))
      redisClient.setEx('blogs', DEFAULT_EXPIRATION,data.post)
      res.status(200).send("Blog added")
    })
  }
  catch(err)
  {
    logger.customLogger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

//delete individual blog
router.delete("/basic/deleteblog/:id",authRole('basic'),authToken,blogSchemaValidator,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) => {
  try
  {
    await blog.findOne({ 
      where: { 
        userId: req.params.id, 
        title: req.body.title 
      }
    })
    .then( async (data)=>{
      await blog.destroy({ where: { 
        userId: req.params.id, 
        title: req.body.title 
      }})
      .then((datas)=>{
        res.status(200).send("Blog deleted ");
      })
    })
  }
  catch(err)
  {
    logger.customLogger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

//update individual blog
router.put("/basic/updateblog/:id",authRole('basic'),authToken,blogSchemaValidator,rateLimiter({secondsWindow:60,allowedHits:5}),async (req, res) =>
{
  try
  {
    await blog.findOne({ 
      where: { 
        userId: req.params.id, 
        title: req.body.title 
      }
    })
    .then( async (data)=>{
      await blog.update({post:req.body.post},{ where: { 
        userId: req.params.id, 
        title: req.body.title 
      }})
      .then((datas)=>{
        res.status(200).send("Blog Updated");
      })
    })
  }
  catch(err)
  {
    logger.customLogger.log('error','Error: ',err)
    res.status(500).send(err);
  }
});

module.exports = router;