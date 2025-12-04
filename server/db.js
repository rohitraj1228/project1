// db.js
const Database = require('better-sqlite3');
const db = new Database('data.db');

// Create products table
db.prepare(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  image TEXT,
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Create orders table (simple)
db.prepare(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  items TEXT,
  total REAL,
  name TEXT,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Seed some sample products if empty
const count = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
if (count === 0) {
  const insert = db.prepare('INSERT INTO products (title, description, price, image, stock) VALUES (?, ?, ?, ?, ?)');
  insert.run('Classic Gold Bangle', 'Polished gold-plated bangle — elegant and timeless.', 29.99, 'sample-products/gold1.jpg', 20);
  insert.run('Kundan Red Bangle', 'Kundan-styled, hand-embellished.', 39.99, 'sample-products/kundan1.jpg', 10);
  insert.run('Pack of 3 Colourful Glass Bangles', 'Vibrant set for daily wear.', 12.50, 'sample-products/glass1.jpg', 50);
}

module.exports = db;
