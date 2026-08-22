const express = require("express");
const router = express.Router();

const {
  getActivitiesByCity,
  addActivityToStop,
  updateActivityInStop,
  deleteActivityFromStop
} = require("../controllers/activities");

// Get activities for a city
router.get("/city/:cityId", getActivitiesByCity);

// Add an activity to a trip stop
router.post("/stops/:stopId", addActivityToStop);

// Update an activity in a trip stop
router.put("/stops/:stopId/activities/:activityId", updateActivityInStop);

// Delete an activity from a trip stop
router.delete("/stops/:stopId/activities/:activityId", deleteActivityFromStop);

module.exports = router;