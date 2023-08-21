const router = require("express").Router();
const user = require("../controllers/users");
const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

const { multerUserMiddleware } = require("../middlewares/multer");

router
  .get(
    "/profile",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
      constants.ROLES.user,
    ]),
    user.getProfile
  ).get(
    "/:urbanization/:username",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
      constants.ROLES.user,
    ]),
    user.getUserData
  )
  .put(
    "/profile",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
      constants.ROLES.user,
    ]),
    user.updateProfile
  )
  .post(
    "/",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
    ]),
    multerUserMiddleware,
    user.create
  )
  .get(
    "/",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
    ]),
    user.getAll
  )
  .get(
    "/:id",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
    ]),
    user.get
  )
  .delete(
    "/:id",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
    ]),
    user.destroy
  )
  .put(
    "/:id",
    verifyJWT,
    canAccess([
      constants.ROLES.superAdministrator,
      constants.ROLES.administrator,
    ]),
    multerUserMiddleware,
    user.update
  );

module.exports = router;
