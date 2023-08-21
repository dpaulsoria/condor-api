const Joi = require("joi");

const roleValidation = (data) => {
  const schema = Joi.object({
    code: Joi.string().max(50).required(),
    name: Joi.string().max(50).required(),
    permissions: Joi.array().items(Joi.string()),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

const assignRoleValidation = (data) => {
  const schema = Joi.object({
    codeRole: Joi.string().max(50).required(),
    username: Joi.string().max(50).required(),
  }).options({ abortEarly: false });;

  return schema.validate(data);
};

module.exports = { roleValidation, assignRoleValidation };
