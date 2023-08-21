const router = require("express").Router();
const carRide = require("../controllers/carRide");

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");
 
router
  .get("/:id", verifyJWT, canAccess(constants.ALL_ROLES), carRide.get)
  .get("/all/:urbanization/:user", verifyJWT, canAccess(constants.ALL_ROLES), carRide.getAll)
  .get("/availiable/:urbanization/:status", verifyJWT, canAccess(constants.ALL_ROLES), carRide.getAllAvailiable)
  .post("/create", verifyJWT, canAccess(constants.ALL_ROLES), carRide.create)
  .delete("/:id", verifyJWT, canAccess(constants.ALL_ROLES), carRide.deleteRegister)
  .put("/configDriver/:id", verifyJWT, canAccess(constants.ALL_ROLES), carRide.configDriver).
  put('/giveGrade/:id', verifyJWT, canAccess(constants.ALL_ROLES), carRide.giveGrade)


module.exports = router;
