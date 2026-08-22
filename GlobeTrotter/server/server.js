const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const cityRoutes = require("./routes/cities");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GlobeTrotter API is running 🚀"
  });
});

app.use("/api/cities", cityRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});