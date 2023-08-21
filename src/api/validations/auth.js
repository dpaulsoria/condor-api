const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(40).required(),
    idCard: Joi.string().length(10).required(),
    fullName: Joi.string().min(5).max(100).required(),
    email: Joi.string().email().required(),
    details: Joi.object(),
    session: Joi.object(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(5).max(40).required(),
    mode: Joi.string(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
