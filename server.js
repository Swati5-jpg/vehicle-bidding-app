const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "vehicle_catalog",
});

db.connect(err => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL database: vehicle_catalog");
});

// Get all vehicles
app.get("/api/vehicles", (req, res) => {
  const sql = "SELECT * FROM vehicles ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Search by registration
app.get("/api/vehicles/:regnr", (req, res) => {
  const regnr = req.params.regnr.trim().toUpperCase();
  const sql = "SELECT * FROM vehicles WHERE regnr = ?";
  db.query(sql, [regnr], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Vehicle not found" });
    res.json(results[0]);
  });
});

// Add new vehicle
app.post("/api/vehicles", (req, res) => {
  const { regnr, make, model, version, first_registration_date, mileage, valuation, amount } = req.body;
  const sql = `INSERT INTO vehicles (regnr, make, model, version, first_registration_date, mileage, valuation, amount)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [regnr, make, model, version, first_registration_date, mileage, valuation, amount], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Vehicle added successfully" });
  });
});

// Place a bid
app.post("/api/bid", (req, res) => {
  const { vehicleId, bidderName, bidAmount } = req.body;
  if (!vehicleId || !bidderName || !bidAmount) return res.status(400).json({ error: "Missing fields" });

  db.query("SELECT highest_bid FROM vehicles WHERE id = ?", [vehicleId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Vehicle not found" });

    const currentBid = results[0].highest_bid || 0;
    if (bidAmount <= currentBid) return res.status(400).json({ error: "Bid must be higher than current highest bid." });

    db.query("UPDATE vehicles SET highest_bid = ?, bidder_name = ? WHERE id = ?", [bidAmount, bidderName, vehicleId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, message: "Bid placed successfully!" });
    });
  });
});
// Export app for Jest tests
module.exports = app;

// Start server only if run directly
if (require.main === module) {
  app.listen(5001, () => console.log("🚀 Server running at http://localhost:5001"));
}


