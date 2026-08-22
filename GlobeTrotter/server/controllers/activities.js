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
// EXPORT CONTROLLERS
// ============================================

module.exports = {
  getActivitiesByCity
};
