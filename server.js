const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// MySQL database connection
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

// GET all vehicles
app.get("/api/vehicles", (req, res) => {
  const sql = "SELECT * FROM vehicles ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET vehicle by registration number
app.get("/api/vehicles/:regnr", (req, res) => {
  const regnr = req.params.regnr.trim().toUpperCase();
  const sql = "SELECT * FROM vehicles WHERE regnr = ?";
  db.query(sql, [regnr], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Vehicle not found" });
    res.json(results[0]);
  });
});

// POST add new vehicle
app.post("/api/vehicles", (req, res) => {
  const { regnr, make, model, version, first_registration_date, mileage, valuation, amount } = req.body;

  // Input validation
  if (!regnr?.trim() || !make?.trim() || !model?.trim()) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const sql = `
    INSERT INTO vehicles (regnr, make, model, version, first_registration_date, mileage, valuation, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [regnr.trim(), make.trim(), model.trim(), version, first_registration_date, mileage, valuation, amount],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Vehicle added successfully" });
    }
  );
});

// POST place a bid by registration number
app.post("/api/bid", (req, res) => {
  const { regnr, bidderName, bidAmount } = req.body;

  // Validation
  if (!regnr?.trim() || !bidderName?.trim() || bidAmount == null) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const bidAmountNum = Number(bidAmount);
  if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
    return res.status(400).json({ error: "Invalid bid amount" });
  }

  const regnrUpper = regnr.trim().toUpperCase();

  // Get current highest bid for this registration number
  db.query("SELECT id, highest_bid FROM vehicles WHERE regnr = ?", [regnrUpper], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Vehicle not found" });

    const vehicle = results[0];
    const currentBid = vehicle.highest_bid || 0;

    if (bidAmountNum <= currentBid) {
      return res.status(400).json({ error: "Bid must be higher than current highest bid." });
    }

    // Update highest bid
    db.query(
      "UPDATE vehicles SET highest_bid = ?, bidder_name = ? WHERE regnr = ?",
      [bidAmountNum, bidderName.trim(), regnrUpper],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, message: "Bid placed successfully!", regnr: regnrUpper });
      }
    );
  });
});


// Export app for testing
module.exports = app;

// Start server if run directly
if (require.main === module) {
  app.listen(5001, () => console.log("🚀 Server running at http://localhost:5001"));
}
