const users = require("../models").users;
const jwt = require("jsonwebtoken");
var joi = require("joi");

//Validation for users table in db
const userSchemaValidator = (req, res, next) =>
{
    const schema = joi.object().keys
    ({
      id: joi.number().integer().min(1).max(100),
      email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in"] },
      }),
      password: joi.string(),
      role: joi.string(),
      oldpassword: joi.string(),
      newpassword: joi.string(),

    }).unknown(false)
  const { error } = schema.validate(req.body, { aboutEarly: false });
  if(error)
  {
    res.status(400).json({ error: error });
  }
  else
  {
    next();
  }
};

//Validation for blogposts table in db
const blogSchemaValidator = (req, res, next) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100),
    email: joi.string(),
    title: joi.string(),
    post: joi.string(),
  }).unknown(false);

  const { error } = schema.validate(req.body, { aboutEarly: false });
  if (error)
  {
    res.status(400).json({ error: error });
  }
  else
  {
    next();
  }
};

module.exports = {
  userSchemaValidator,
  blogSchemaValidator,
};
