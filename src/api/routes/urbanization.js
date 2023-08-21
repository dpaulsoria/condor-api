const router = require("express").Router();

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

const {
  getAll,
  get,
  create,
  update,
  destroy,
} = require("../controllers/urbanization");

router
  .get("/", verifyJWT, canAccess([constants.ROLES.superAdministrator]), getAll)
  .post("/", verifyJWT, canAccess([constants.ROLES.superAdministrator]), create)
  .get("/:id", verifyJWT, canAccess([constants.ROLES.superAdministrator]), get)

  .put(
    "/:id",
    verifyJWT,
    canAccess([constants.ROLES.superAdministrator]),
    update
  )
  .delete(
    "/:id",    
    verifyJWT,
    canAccess([constants.ROLES.superAdministrator]),
    destroy
  );

module.exports = router;
