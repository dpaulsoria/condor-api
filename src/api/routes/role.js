const router = require("express").Router();
const role = require("../controllers/roles");

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

router
  .get(
    "/",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
    ]),
    role.get
  )
  .post("/", role.create)
  .post("/assign", role.assign);

module.exports = router;
