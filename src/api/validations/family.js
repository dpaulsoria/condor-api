const Joi = require("joi");

const familyValidation = (data, updating = false) => {
  const schema = Joi.object({
    ...(!updating && { code: Joi.string().max(50).required() }),
    name: Joi.string().max(100).required(),
    address: Joi.string().max(100).required(),
    phones: Joi.array().items(Joi.string()),
    aliquot: Joi.number().required(),
    // codeUrbanization: Joi.string().max(25).required(),
    details: Joi.object(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

const assignFamilyValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().max(50).required(),
    codeFamily: Joi.string().max(50).required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = { familyValidation, assignFamilyValidation };
