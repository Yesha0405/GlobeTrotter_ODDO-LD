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
      "SELECT id FROM trips WHERE id = ?",
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
      "SELECT id, name FROM cities WHERE id = ?",
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
      JOIN cities c ON ts.city_id = c.id
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

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  addStop
};