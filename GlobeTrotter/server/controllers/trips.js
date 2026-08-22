const db = require("../config/db");

const {
  calculateTripBudget
} = require("../services/budget");

// ============================================
// CREATE TRIP
// POST /api/trips
// ============================================

const createTrip = async (req, res) => {
  try {
    const {
      name,
      description,
      start_date,
      end_date,
      budget
    } = req.body;

    if (!name || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "Name, start date and end date are required"
      });
    }

    // Demo user for hackathon
    const userId = 1;

    const shareToken =
      `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    const [result] = await db.query(
      `
      INSERT INTO trips
      (
        user_id,
        name,
        description,
        start_date,
        end_date,
        budget,
        is_public,
        share_token
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        name,
        description || null,
        start_date,
        end_date,
        budget || 0,
        false,
        shareToken
      ]
    );

    const [trip] = await db.query(
      `
      SELECT *
      FROM trips
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Trip created successfully 🎉",
      trip: trip[0]
    });

  } catch (error) {
    console.error("Create trip error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create trip",
      error: error.message
    });
  }
};


// ============================================
// GET ALL TRIPS
// GET /api/trips
// ============================================

const getTrips = async (req, res) => {
  try {
    // Demo user for hackathon
    const userId = 1;

    const [trips] = await db.query(
      `
      SELECT
        id,
        name,
        description,
        start_date,
        end_date,
        budget,
        is_public,
        share_token,
        created_at
      FROM trips
      WHERE user_id = ?
      ORDER BY start_date ASC
      `,
      [userId]
    );

    res.json({
      success: true,
      count: trips.length,
      trips
    });

  } catch (error) {
    console.error("Get trips error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trips",
      error: error.message
    });
  }
};


// ============================================
// GET SINGLE TRIP
// GET /api/trips/:id
// ============================================

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get trip details
    const [trips] = await db.query(
      `
      SELECT
        id,
        user_id,
        name,
        description,
        start_date,
        end_date,
        budget,
        is_public,
        share_token,
        created_at
      FROM trips
      WHERE id = ?
      `,
      [id]
    );

    if (trips.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // Get trip stops + city information
    const [stops] = await db.query(
      `
      SELECT
        ts.id,
        ts.city_id,
        ts.start_date,
        ts.end_date,
        ts.stop_order,
        c.name AS city_name,
        c.country,
        c.region,
        c.cost_index,
        c.image_url
      FROM trip_stops ts
      JOIN cities c
        ON ts.city_id = c.id
      WHERE ts.trip_id = ?
      ORDER BY ts.stop_order ASC
      `,
      [id]
    );

    // Get activities belonging to this trip
    const [activities] = await db.query(
      `
      SELECT
        ta.id,
        ta.trip_stop_id,
        ta.activity_date,
        ta.start_time,

        a.id AS activity_id,
        a.name,
        a.description,
        a.category,
        a.duration_hours,
        a.estimated_cost,
        a.image_url

      FROM trip_activities ta

      JOIN activities a
        ON ta.activity_id = a.id

      JOIN trip_stops ts
        ON ta.trip_stop_id = ts.id

      WHERE ts.trip_id = ?

      ORDER BY
        ta.activity_date ASC,
        ta.start_time ASC
      `,
      [id]
    );

    res.json({
      success: true,
      trip: trips[0],
      stops,
      activities
    });

  } catch (error) {
    console.error("Get trip by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
      error: error.message
    });
  }
};


// ============================================
// ADD CITY / STOP TO TRIP
// POST /api/trips/:id/stops
// ============================================

const addStop = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      city_id,
      start_date,
      end_date
    } = req.body;

    if (!city_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "city_id, start_date and end_date are required"
      });
    }

    // Check trip exists
    const [trips] = await db.query(
      `
      SELECT id
      FROM trips
      WHERE id = ?
      `,
      [id]
    );

    if (trips.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // Check city exists
    const [cities] = await db.query(
      `
      SELECT id, name
      FROM cities
      WHERE id = ?
      `,
      [city_id]
    );

    if (cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "City not found"
      });
    }

    // Find next stop order
    const [orderResult] = await db.query(
      `
      SELECT COALESCE(MAX(stop_order), 0) + 1 AS next_order
      FROM trip_stops
      WHERE trip_id = ?
      `,
      [id]
    );

    const stopOrder = orderResult[0].next_order;

    // Add stop
    const [result] = await db.query(
      `
      INSERT INTO trip_stops
      (
        trip_id,
        city_id,
        start_date,
        end_date,
        stop_order
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        id,
        city_id,
        start_date,
        end_date,
        stopOrder
      ]
    );

    // Return newly created stop
    const [stops] = await db.query(
      `
      SELECT
        ts.id,
        ts.trip_id,
        ts.city_id,
        ts.start_date,
        ts.end_date,
        ts.stop_order,

        c.name AS city_name,
        c.country,
        c.region

      FROM trip_stops ts

      JOIN cities c
        ON ts.city_id = c.id

      WHERE ts.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "City added to trip successfully 🎉",
      stop: stops[0]
    });

  } catch (error) {
    console.error("Add stop error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add city to trip",
      error: error.message
    });
  }
};

// ============================================
// GET TRIP BUDGET
// GET /api/trips/:id/budget
// ============================================

const getTripBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await calculateTripBudget(id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    res.json({
      success: true,
      budget
    });

  } catch (error) {
    console.error("Get trip budget error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate trip budget",
      error: error.message
    });
  }
};

// ============================================
// EXPORT CONTROLLERS
// ============================================

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  addStop,
  getTripBudget
};