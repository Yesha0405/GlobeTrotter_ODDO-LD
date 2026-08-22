const express = require("express");
const router = express.Router();

const { createTrip } = require("../controllers/trips");

router.post("/", createTrip);

module.exports = router;
