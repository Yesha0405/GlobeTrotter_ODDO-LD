const db = require("../config/db");

const createTrip = async (req, res) => {
  try {
    const {
      name,
      description,
      start_date,
      end_date,
      budget
    } = req.body;

    // Basic validation
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

const getTrips = async (req, res) => {
  try {
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

    // Get stops + city information
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
      JOIN cities c ON ts.city_id = c.id
      WHERE ts.trip_id = ?
      ORDER BY ts.stop_order ASC
      `,
      [id]
    );

    // Get activities for the trip
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
      JOIN activities a ON ta.activity_id = a.id
      JOIN trip_stops ts ON ta.trip_stop_id = ts.id
      WHERE ts.trip_id = ?
      ORDER BY ta.activity_date ASC, ta.start_time ASC
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

module.exports = {
  createTrip,
  getTrips,
  getTripById
};

