const express = require("express");
const users = require("../models").users;
const blog = require("../models").blogposts;
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();
require("../auth/passport");

const userRoutes=require("./userRoutes")
const blogroutes=require("./blogroutes")
const adminRoutes=require("./adminroutes")
router.use('/',userRoutes)
router.use('/',blogroutes)
router.use('/',adminRoutes)

module.exports = router;





