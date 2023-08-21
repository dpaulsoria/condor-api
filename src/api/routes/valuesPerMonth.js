/** @format */

const router = require("express").Router();
const valuesPerMonth = require("../controllers/valuesPerMonth");

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

router
  .get(
    "/",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    valuesPerMonth.getAll
  )
  .get(
    "/:id",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    valuesPerMonth.get
  );
module.exports = router;
