const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());


// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GlobeTrotter API is running 🚀"
  });
});


// Test MySQL + GlobeTrotter database
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cities");

    res.json({
      success: true,
      message: "GlobeTrotter database connected 🎉",
      cities: rows
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      message: "Database query failed",
      error: error.message
    });
  }
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});