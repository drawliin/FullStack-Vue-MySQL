CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name, description) VALUES
  ('Item 1', 'Description for Item 1'),
  ('Item 2', 'Description for Item 2'),
  ('Item 3', 'Description for Item 3');