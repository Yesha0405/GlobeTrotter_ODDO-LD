const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  addStop,
  getTripBudget
} = require("../controllers/trips");

// Get all trips
router.get("/", getTrips);

// Create a trip
router.post("/", createTrip);

// Get trip budget
router.get("/:id/budget", getTripBudget);

// Get a single trip
router.get("/:id", getTripById);

// Add city/stop to trip
router.post("/:id/stops", addStop);

module.exports = router;