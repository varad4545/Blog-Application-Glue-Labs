
var joi = require("joi");
const {skip}=require('graphql-resolvers')

//Validation for users table in db
const userSchemaValidator = (parent, args) =>
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
      adminid:joi.number().integer().min(1).max(100)

    }).unknown(false)
  const { error } = schema.validate(args, { aboutEarly: false });
  if(error)
  {
    throw new Error(error);
  }
  else
  {
    console.log("Schema okay")
    skip;
  }
};

//Validation for blogposts table in db
const blogSchemaValidator = (parent ,args) => {
  const schema = joi.object().keys({
    id: joi.number().integer().min(1).max(100),
    email: joi.string(),
    title: joi.string(),
    post: joi.string(),
  }).unknown(false);

  const { error } = schema.validate(args, { aboutEarly: false });
  if (error)
  {
    throw new Error(error);
  }
  else
  {
    skip;
  }
};

module.exports = {
  userSchemaValidator,
  blogSchemaValidator,
};
