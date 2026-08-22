const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById
} = require("../controllers/trips");

router.get("/", getTrips);
router.post("/", createTrip);
router.get("/:id", getTripById);

module.exports = router;