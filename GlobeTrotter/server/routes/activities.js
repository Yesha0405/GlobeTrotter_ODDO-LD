const express = require("express");
const router = express.Router();

const {
  getActivitiesByCity
} = require("../controllers/activities");

// Get activities for a specific city
router.get("/city/:cityId", getActivitiesByCity);

module.exports = router;
