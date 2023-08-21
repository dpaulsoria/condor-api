const Joi = require("joi");
const { JsonWebTokenError } = require("jsonwebtoken");

const carRideValidation = (data) => {
  const schema = Joi.object({
    /* driver: Joi.string().max(50).required(), */
    passenger: Joi.string().max(50).required(),
    coordinates: Joi.object().required(),
    availabilityDate: Joi.date().required(),
    requestDate: Joi.date().required(),
    timeZoneName: Joi.string(),
    status: Joi.string().max(25),
    observations: Joi.object(),
    pay: Joi.number(),
    urbanization: Joi.string().max(25)
  }).options({ abortEarly: false });

  return schema.validate(data);
};

module.exports = carRideValidation;
