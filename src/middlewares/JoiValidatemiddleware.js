var Joi = require("joi");

function validateSignUp(req, res, next) {
  const schema = Joi.object().keys({
    id: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(200).json({ error: error });
  } else {
    next();
  }
}

function validateLogin(req, res, next) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(200).json({ error: error });
  } else {
    next();
  }
}

function validateChangePassword(req, res, next) {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    oldpassword: Joi.string().required(),
    newpassword: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(200).json({ error: error });
  } else {
    next();
  }
}

function validateDeleteuserAdmin(req, res, next) {
  const schema = Joi.object().keys({
    id: Joi.number().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(200).json({ error: error });
  } else {
    next();
  }
}

function validateUpdateuserAdmin(req, res, next) {
  const schema = Joi.object().keys({
    id: Joi.number().required(),
    email: Joi.string().email().required(),
  });
  console.log(req.body);
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error });
  } else {
    next();
  }
}

function validateUserPost(req, res, next) {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    post: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(200).json({ error: error });
  } else {
    next();
  }
}

function validateDeleteUserPost(req, res, next) {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(200).json({ error: error });
  } else {
    next();
  }
}

module.exports = {
  validateSignUp,
  validateLogin,
  validateChangePassword,
  validateDeleteuserAdmin,
  validateUpdateuserAdmin,
  validateUserPost,
  validateDeleteUserPost,
};
