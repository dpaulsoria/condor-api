/** @format */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const encryptData = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

function createToken(data, days = "") {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: days == "" ? 86400 * 1 : days,
  });
}

module.exports = {
  encryptData,
  createToken,
};
