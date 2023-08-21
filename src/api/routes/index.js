/** @format */

const express = require("express");
const auth = require("./auth");
const user = require("./user");
const family = require("./family");
const role = require("./role");
const carRide = require("./carRide");
const urbanization = require("./urbanization");
const payment = require("./payment");
const valuesPerMonth = require("./valuesPerMonth");

const router = express.Router();

//Routes
router.use("/auth", auth);
router.use("/users", user);
router.use("/families", family);
router.use("/roles", role);
router.use("/carRides", carRide);
router.use("/urbanizations", urbanization);
router.use("/payments", payment);
router.use("/valuesPerMonth", valuesPerMonth);
module.exports = router;
