const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  addStop
} = require("../controllers/trips");

router.get("/", getTrips);
router.post("/", createTrip);
router.get("/:id", getTripById);
router.post("/:id/stops", addStop);

module.exports = router;