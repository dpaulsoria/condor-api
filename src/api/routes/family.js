const router = require("express").Router();
const family = require("../controllers/families");

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

router
  .get("/", verifyJWT, canAccess([constants.ROLES.administrator]), family.getAll)
  .get("/:id", verifyJWT, canAccess([constants.ROLES.administrator]), family.get)
  .get("/:code", verifyJWT, canAccess([constants.ROLES.administrator]), family.getByCode)
  .post(
    "/",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    family.create
  )
  .put(
    "/:id",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    family.update
  )
  .delete(
    "/:id",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    family.destroy
  );

module.exports = router;

