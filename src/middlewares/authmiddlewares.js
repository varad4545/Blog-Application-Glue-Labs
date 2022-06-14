const users = require("../models").users;
const jwt = require("jsonwebtoken");
var Joi = require("joi");

function authRoleLogin(role) {
  return async (req, res, next) => {
    const locateuser = await users.findOne({
      where: { email: req.body.email, password: req.body.password, role: role },
    });
    if (locateuser) {
      const getuser = locateuser.toJSON();
      next();
    } else {
      res.send("User doesnt exist or the link is wrong");
    }
  };
}

function authBasic() {
  return async (req, res, next) => {
    const locateuser = await users.findOne({ where: { id: req.params.id } });
    if (locateuser) {
      const getuser = locateuser.toJSON();
      if (getuser.role === "basic") {
        next();
      } else {
        res.send("Admin not allowed");
      }
    } else {
      res.send("User doesnt exist");
    }
  };
}

function authAdminAccess() {
  return async (req, res, next) => {
    const locateuser = await users.findOne({ where: { id: req.params.id } });
    if (locateuser) {
      const getuser = locateuser.toJSON();
      if (getuser.role === "admin") {
        next();
      } else {
        res.send("User not allowed");
      }
    } else {
      res.send("Admin doesnt exist");
    }
  };
}

function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = { authRoleLogin, authBasic, authAdminAccess, authToken };
