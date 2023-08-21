const Joi = require("joi");

const userCreateValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    fullName: Joi.string().min(5).max(100).required(),
    password: Joi.string().min(5).max(40).required(),
    idCard: Joi.string().max(15).required(),
    codeRole: Joi.array().items(Joi.string()).min(1).required(),
    codeUrbanization: Joi.string().max(25),
    codeFamily: Joi.array().items(Joi.string()).min(1),
    details: Joi.object(),
    session: Joi.object(),
    // Images
    profileImage: Joi.array().items(Joi.object()).min(1).max(1),
    car: Joi.array().items(Joi.object()).min(1).max(3),
    carPlate: Joi.array().items(Joi.object()).min(1).max(1),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

const userUpdateValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(5).max(40),
    codeFamily: Joi.array().items(Joi.string()).min(1),
    codeRole: Joi.array().items(Joi.string()).min(1),
    codeUrbanization: Joi.string().max(25),
    details: Joi.object(),

    profileImage: Joi.array().items(Joi.object()).min(1).max(1),
    car: Joi.array().items(Joi.object()).min(1).max(3),
    carPlate: Joi.array().items(Joi.object()).min(1).max(1),

    // Seria mejor objeto, analiza en refactorización
    carPlateUpdated: Joi.string(),
    carUpdated: Joi.string(),
    profileImageUpdated: Joi.string(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

const updateProfileValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(5).max(40),
    details: Joi.object(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
  userCreateValidation,
  userUpdateValidation,
  updateProfileValidation,
};
