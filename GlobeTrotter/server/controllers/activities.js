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
      start_time,
      name,
      type,
      duration,
      price,
      description
    } = req.body;

    // Check stop exists
    const [stops] = await db.query(
      `
      SELECT
        id,
        trip_id,
        city_id,
        start_date
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

    let finalActivityId = activity_id;

    if (!finalActivityId) {
      // If activity_id is missing, we must have a custom name to create it
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "activity_id or custom activity name is required"
        });
      }

      // Create custom activity in the city
      const [newActResult] = await db.query(
        `
        INSERT INTO activities
        (
          city_id,
          name,
          category,
          duration_hours,
          estimated_cost,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          stops[0].city_id,
          name,
          type || "Other",
          duration ? Number(duration) / 60 : 1.0,
          price ? Number(price) : 0.0,
          description || null
        ]
      );
      finalActivityId = newActResult.insertId;
    } else {
      // Check predefined activity exists
      const [activities] = await db.query(
        `
        SELECT
          id,
          city_id,
          name
        FROM activities
        WHERE id = ?
        `,
        [finalActivityId]
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
    }

    const finalActivityDate = activity_date || stops[0].start_date;

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
        finalActivityId,
        finalActivityDate,
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
// UPDATE ACTIVITY IN STOP
// PUT /api/activities/stops/:stopId/activities/:activityId
// ============================================

const updateActivityInStop = async (req, res) => {
  try {
    const { stopId, activityId } = req.params;
    const {
      name,
      type,
      time,
      duration,
      price,
      description
    } = req.body;

    // Find the activity_id associated with this trip_activities record
    const [tripActivities] = await db.query(
      `
      SELECT activity_id
      FROM trip_activities
      WHERE id = ?
      AND trip_stop_id = ?
      `,
      [activityId, stopId]
    );

    if (tripActivities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity record not found on this stop"
      });
    }

    const linkedActivityId = tripActivities[0].activity_id;

    // Update the custom activity details in the activities table
    await db.query(
      `
      UPDATE activities
      SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        duration_hours = COALESCE(?, duration_hours),
        estimated_cost = COALESCE(?, estimated_cost),
        description = COALESCE(?, description)
      WHERE id = ?
      `,
      [
        name || null,
        type || null,
        duration !== undefined ? Number(duration) / 60 : null,
        price !== undefined ? Number(price) : null,
        description !== undefined ? description : null,
        linkedActivityId
      ]
    );

    // Update the time in the trip_activities record
    await db.query(
      `
      UPDATE trip_activities
      SET
        start_time = ?
      WHERE id = ?
      `,
      [time || null, activityId]
    );

    // Return updated activity
    const [updatedActivity] = await db.query(
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
      [activityId]
    );

    res.json({
      success: true,
      message: "Activity updated successfully",
      activity: updatedActivity[0]
    });

  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update activity",
      error: error.message
    });
  }
};


// ============================================
// DELETE ACTIVITY FROM STOP
// DELETE /api/activities/stops/:stopId/activities/:activityId
// ============================================

const deleteActivityFromStop = async (req, res) => {
  try {
    const { stopId, activityId } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM trip_activities
      WHERE id = ?
      AND trip_stop_id = ?
      `,
      [activityId, stopId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Activity record not found on this stop"
      });
    }

    res.json({
      success: true,
      message: "Activity removed from stop successfully"
    });

  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove activity",
      error: error.message
    });
  }
};


// ============================================
// EXPORT
// ============================================

module.exports = {
  getActivitiesByCity,
  addActivityToStop,
  updateActivityInStop,
  deleteActivityFromStop
};