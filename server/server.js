// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Static file serving ---
// Serve uploaded files (images uploaded via the API)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve client public folder (optional — serves everything under client/public)
app.use("/public", express.static(path.join(__dirname, "..", "client", "public")));

// Serve sample product images directly from client/public/sample-products
// Example: GET /sample-products/gold1.jpg  -> client/public/sample-products/gold1.jpg
app.use(
  "/sample-products",
  express.static(path.join(__dirname, "..", "client", "public", "sample-products"))
);

// --- Multer for product image uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, name);
  },
});
const upload = multer({ storage });

// --- Products API ---
app.get("/api/products", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// Admin: create product with image
app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    const { title, description, price, stock } = req.body;
    // If uploaded via multer, store path as uploads/<filename>
    // If the client already provided an image path (rare), allow that too
    const image = req.file ? `uploads/${req.file.filename}` : req.body.image || null;
    if (!title || !price) return res.status(400).json({ error: "title and price required" });

    const stmt = db.prepare(
      "INSERT INTO products (title, description, price, image, stock) VALUES (?, ?, ?, ?, ?)"
    );
    const info = stmt.run(title, description || "", Number(price), image, Number(stock || 0));
    const created = db.prepare("SELECT * FROM products WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// --- Orders API ---
app.post("/api/orders", (req, res) => {
  try {
    const { items, total, name, email } = req.body;
    if (!items || !total) return res.status(400).json({ error: "items and total required" });

    const stmt = db.prepare("INSERT INTO orders (items, total, name, email) VALUES (?, ?, ?, ?)");
    const info = stmt.run(JSON.stringify(items), Number(total), name || "", email || "");
    const created = db.prepare("SELECT * FROM orders WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Fallback - helpful for debugging root
app.get("/", (req, res) => {
  res.type("text").send("API server running. Use /api endpoints.");
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
