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

module.exports = {
  createTrip
};
