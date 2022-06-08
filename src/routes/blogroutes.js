const express = require("express");
const users = require("../models").users;
const blog = require("../models").blogposts;
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const logger=require('../../utils/logger')
const {authToken,authBasic} = require("../middlewares/authmiddlewares");
const {validateUserPost,validateDeleteUserPost}=require("../middlewares/JoiValidatemiddleware")
require("dotenv").config();
require("../auth/passport");
const redisClient=require('../../utils/redisClient.js')
const DEFAULT_EXPIRATION=3600

//get individual blogs
router.get("/basic/getblog/:id", authBasic(), authToken, async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  let getCacheData = await redisClient.get("blog");
  if (getCacheData) {
    console.log("Cache Hit");
    return res.json(JSON.parse(getCacheData));
  } else {
    console.log("Cache Miss");
    const locateEntry = await blog.findOne({ where: { id: id } });
    const getEntry = locateEntry.toJSON();
    const getPost = getEntry.post;
    var setPost = JSON.parse(getPost);
    setPost = setPost.filter((user) => {
      if (user["title"] === body.title) {
        return 1;
      }
    });
    redisClient.setEx("blog", DEFAULT_EXPIRATION, JSON.stringify(setPost));
    setPost = JSON.stringify(setPost);
    res.status(200).send(setPost);
  }
});

//get all blogs of a user
router.get(
  "/basic/getallblogs/:id",authBasic(),authToken,async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    let getCacheData = await redisClient.get("blogs");
    if (getCacheData) {
      console.log("Cache Hit");
      return res.json(JSON.parse(getCacheData));
    } else {
      console.log("Cache Miss");
      const locateEntry = await blog.findOne({ where: { id: id } });
      const getEntry = locateEntry.toJSON();
      const getPost = getEntry.post;
      var setPost = JSON.parse(getPost);
      redisClient.setEx("blogs", DEFAULT_EXPIRATION, JSON.stringify(setPost));
      res.status(200).send(setPost);
    }
  }
);

//post blogs
router.post("/basic/postblog/:id",authBasic(),authToken,validateUserPost,async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    if (locateEntry) {
      const getEntry = locateEntry.toJSON();
      const getPost = getEntry.post;
      var setPost = JSON.parse(getPost);
      var addObj = { title: body.title, post: body.post };
      setPost.push(addObj);
      setPost = JSON.stringify(setPost);
      blog
        .update(
          {
            id: id,
            email: getEntry.email,
            post: setPost,
          },
          { where: { id: id } }
        )
        .then((value) => {
         res.status(200).send("Blog added")
        })
        .catch((error) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    } else {
      const locatefromUser = await users.findOne({ where: { id: id } });
      const getfromUser = locatefromUser.toJSON();
      const getEmail = getfromUser.email;
      var postarray = [];
      var postobj = { title: body.title, post: body.post };
      postarray.push(postobj);
      var pusharray = JSON.stringify(postarray);
      blog
        .create({
          id: id,
          email: getEmail,
          post: pusharray,
        })
        .then((value) => {
          res.status(200).send("Blog posted")
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    }
  }
);

//delete individual blog
router.delete("/basic/deleteblog/:id",authBasic(),authToken,validateDeleteUserPost,async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    const getEntry = locateEntry.toJSON();
    const getPost = getEntry.post;
    var setPost = JSON.parse(getPost);
    setPost = setPost.filter((user) => {
      if (user["title"] != body.title) {
        return 1;
      }
    });
    setPost = JSON.stringify(setPost);
    blog
      .update(
        {
          id: id,
          email: getEntry.email,
          post: setPost,
        },
        { where: { id: id } }
      )
      .then((value) => {
        res.status(200).send("Blog deleted")
      })
      .catch((error) => {
        logger.customLogger.log('error',"Error: "+err)
      });
  }
);

//update individual blog
router.put("/basic/updateblog/:id",authBasic(),authToken,validateUserPost,async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    const getEntry = locateEntry.toJSON();
    const getPost = getEntry.post;
    var setPost = JSON.parse(getPost);
    setPost.map((user) => {
      if (user["title"] === body.title) {
        user["post"] = body.post;
      }
    });
    setPost = JSON.stringify(setPost);
    blog
      .update(
        {
          id: id,
          email: getEntry.email,
          post: setPost,
        },
        { where: { id: id } }
      )
      .then((value) => {
        res.status(200).send("Blog updated")
      })
      .catch((err) => {
        logger.customLogger.log('error',"Error: "+err)
      });
  }
);

module.exports = router;