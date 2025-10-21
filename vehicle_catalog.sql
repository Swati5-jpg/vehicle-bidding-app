-- Use your database
CREATE DATABASE IF NOT EXISTS vehicle_catalog;
USE vehicle_catalog;

-- Drop the old table if it exists (⚠️ this deletes all old data)
DROP TABLE IF EXISTS vehicles;

-- Create the updated vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  regnr VARCHAR(32) NOT NULL UNIQUE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  version VARCHAR(100) DEFAULT NULL,
  first_registration_date DATE DEFAULT NULL,
  mileage INT DEFAULT NULL,
  status ENUM('active','sold') DEFAULT 'active',
  valuation ENUM('pending','received','done') DEFAULT 'pending',  -- ✅ new column
  amount DECIMAL(10,2) DEFAULT 0,                                  -- ✅ new column
  user_id INT DEFAULT NULL,
  bidder_name VARCHAR(100) DEFAULT NULL,
  highest_bid DECIMAL(10,2) DEFAULT NULL,                          -- in SEK
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample rows (matching your previous data but with valuation + amount
INSERT INTO vehicles 
  (regnr, make, model, version, first_registration_date, mileage, status, valuation, amount, user_id, bidder_name, highest_bid)
VALUES
  ('ABC123', 'Volvo', 'V60', 'T5 Momentum', '2018-05-12', 72000, 'active', 'pending', 0.00, 1, 'Erik Larsson', 155000.00),
  ('XYZ999', 'Toyota', 'Corolla', '1.8 Hybrid', '2016-03-01', 98000, 'sold', 'done', 130000.00, 2, 'Anna Svensson', 130000.00),
  ('LMN456', 'Ford', 'Focus', 'Titanium', '2020-09-30', 15000, 'active', 'received', 178500.00, 3, 'Johan Berg', 178500.00);

-- View all vehicles
SELECT * FROM vehicles;
