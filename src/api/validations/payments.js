const Joi = require("joi");

const paymentsValidation = (data, updating = false) => {
  const schema = Joi.object({
    payvalue: Joi.number().required(),
    issueDate: Joi.date().required(),
    stateuser: Joi.string().max(10).required(),
    // familyCode: Joi.string().max(25).required(),
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = {
    paymentsValidation,
  };
  