const router = require("express").Router();
const payment = require("../controllers/payments");

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

router
  .get("/", verifyJWT, canAccess([constants.ROLES.administrator]), payment.getAll)
  .get("/:id", verifyJWT, canAccess([constants.ROLES.administrator]), payment.get);
module.exports = router;
