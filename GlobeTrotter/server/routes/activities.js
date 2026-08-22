const express = require("express");
const router = express.Router();

const {
  getActivitiesByCity,
  addActivityToStop
} = require("../controllers/activities");

// Get activities for a city
router.get("/city/:cityId", getActivitiesByCity);

// Add an activity to a trip stop
router.post("/stops/:stopId", addActivityToStop);

module.exports = router;