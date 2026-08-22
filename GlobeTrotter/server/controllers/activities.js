const db = require("../config/db");

// ============================================
// GET ACTIVITIES BY CITY
// GET /api/activities/city/:cityId
// ============================================

const getActivitiesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const [activities] = await db.query(
      `
      SELECT
        id,
        city_id,
        name,
        description,
        category,
        duration_hours,
        estimated_cost,
        image_url
      FROM activities
      WHERE city_id = ?
      ORDER BY category ASC, name ASC
      `,
      [cityId]
    );

    res.json({
      success: true,
      count: activities.length,
      activities
    });

  } catch (error) {
    console.error("Get activities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
      error: error.message
    });
  }
};


// ============================================
// ADD ACTIVITY TO TRIP STOP
// POST /api/activities/stops/:stopId
// ============================================

const addActivityToStop = async (req, res) => {
  try {
    const { stopId } = req.params;

    const {
      activity_id,
      activity_date,
      start_time
    } = req.body;

    if (!activity_id || !activity_date) {
      return res.status(400).json({
        success: false,
        message: "activity_id and activity_date are required"
      });
    }

    // Check stop exists
    const [stops] = await db.query(
      `
      SELECT
        id,
        trip_id,
        city_id
      FROM trip_stops
      WHERE id = ?
      `,
      [stopId]
    );

    if (stops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip stop not found"
      });
    }

    // Check activity exists
    const [activities] = await db.query(
      `
      SELECT
        id,
        city_id,
        name
      FROM activities
      WHERE id = ?
      `,
      [activity_id]
    );

    if (activities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      });
    }

    // Make sure activity belongs to the same city as the stop
    if (activities[0].city_id !== stops[0].city_id) {
      return res.status(400).json({
        success: false,
        message: "Activity does not belong to this city"
      });
    }

    // Add activity to trip stop
    const [result] = await db.query(
      `
      INSERT INTO trip_activities
      (
        trip_stop_id,
        activity_id,
        activity_date,
        start_time
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        stopId,
        activity_id,
        activity_date,
        start_time || null
      ]
    );

    // Return added activity
    const [addedActivity] = await db.query(
      `
      SELECT
        ta.id,
        ta.trip_stop_id,
        ta.activity_id,
        ta.activity_date,
        ta.start_time,

        a.name,
        a.description,
        a.category,
        a.duration_hours,
        a.estimated_cost

      FROM trip_activities ta

      JOIN activities a
        ON ta.activity_id = a.id

      WHERE ta.id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Activity added to itinerary successfully 🎉",
      activity: addedActivity[0]
    });

  } catch (error) {
    console.error("Add activity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add activity",
      error: error.message
    });
  }
};


// ============================================
// EXPORT
// ============================================

module.exports = {
  getActivitiesByCity,
  addActivityToStop
};