const db = require("../config/db");

const calculateTripBudget = async (tripId) => {
  // Get trip budget
  const [trips] = await db.query(
    `
    SELECT
      id,
      name,
      budget
    FROM trips
    WHERE id = ?
    `,
    [tripId]
  );

  if (trips.length === 0) {
    return null;
  }

  const trip = trips[0];

  // Get normal expenses
  const [expenses] = await db.query(
    `
    SELECT
      category,
      COALESCE(SUM(amount), 0) AS amount
    FROM expenses
    WHERE trip_id = ?
    GROUP BY category
    `,
    [tripId]
  );

  // Get selected activity costs
  const [activityResult] = await db.query(
    `
    SELECT
      COALESCE(SUM(a.estimated_cost), 0) AS amount
    FROM trip_activities ta
    JOIN activities a
      ON ta.activity_id = a.id
    JOIN trip_stops ts
      ON ta.trip_stop_id = ts.id
    WHERE ts.trip_id = ?
    `,
    [tripId]
  );

  // Create breakdown
  const breakdown = {
    Transport: 0,
    Accommodation: 0,
    Food: 0,
    Activities: Number(activityResult[0].amount || 0),
    Other: 0
  };

  // Add expenses to breakdown
  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = Number(expense.amount);

    if (breakdown[category] !== undefined) {
      breakdown[category] += amount;
    } else {
      breakdown.Other += amount;
    }
  });

  // Calculate total
  const spent = Object.values(breakdown).reduce(
    (total, amount) => total + amount,
    0
  );

  const budget = Number(trip.budget || 0);
  const remaining = budget - spent;

  return {
    trip_id: trip.id,
    trip_name: trip.name,
    budget,
    spent,
    remaining,
    breakdown
  };
};

module.exports = {
  calculateTripBudget
};
