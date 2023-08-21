/** @format */

const router = require("express").Router();
const auth = require("../controllers/auth");

router
  .post("/signin", auth.login)
  .post("/signup", auth.register)
  .post("/forgotP", auth.forgotPassword)
  .post("/resetPassword", auth.resetPassword);

module.exports = router;
