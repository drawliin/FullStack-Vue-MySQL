const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "test"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Create
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
  db.query(query, [name, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error creating item' });
    } else {
      res.status(201).json({ id: result.insertId, name, description });
    }
  });
});

// Read
app.get('/api/items', (req, res) => {
  const query = 'SELECT * FROM items';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching items' });
    } else {
      res.json(results);
    }
  });
});

// Update
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error updating item' });
    } else {
      res.json({ id, name, description });
    }
  });
});

// Delete
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM items WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting item' });
    } else {
      res.json({ message: 'Item deleted successfully' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});