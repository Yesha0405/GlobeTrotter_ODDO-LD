const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  addStop,
  getTripBudget,
  addExpense,
  deleteExpense,
  deleteStop
} = require("../controllers/trips");


// GET all trips
router.get("/", getTrips);

// CREATE trip
router.post("/", createTrip);

// GET budget
router.get("/:id/budget", getTripBudget);

// ADD expense
router.post("/:id/expenses", addExpense);

// DELETE expense
router.delete("/:id/expenses/:expenseId", deleteExpense);

// GET single trip
router.get("/:id", getTripById);

// ADD stop
router.post("/:id/stops", addStop);

// DELETE stop
router.delete("/:id/stops/:stopId", deleteStop);

module.exports = router;