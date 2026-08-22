const db = require("../config/db");

const getCities = async (req, res) => {
  try {
    const [cities] = await db.query(`
      SELECT
        id,
        name,
        country,
        region,
        cost_index,
        image_url
      FROM cities
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      count: cities.length,
      cities
    });
  } catch (error) {
    console.error("Get cities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
      error: error.message
    });
  }
};

module.exports = {
  getCities
};
