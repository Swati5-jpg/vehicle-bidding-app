SELECT * FROM vehicle_catalog.dealers;
CREATE TABLE IF NOT EXISTS dealers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL  -- hashed password recommended
);

-- Insert demo dealer (password = '123456')
INSERT INTO dealers (username, password) VALUES ('dealer1', '123456');
