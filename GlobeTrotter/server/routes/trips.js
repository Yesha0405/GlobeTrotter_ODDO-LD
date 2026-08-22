const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  addStop
} = require("../controllers/trips");

// Get all trips
router.get("/", getTrips);

// Create a new trip
router.post("/", createTrip);

// Get a single trip with stops and activities
router.get("/:id", getTripById);

// Add a city/stop to a trip
router.post("/:id/stops", addStop);

module.exports = router;