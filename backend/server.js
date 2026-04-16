const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// create uploads folder
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// database
const db = new sqlite3.Database("database.db");

// users table
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
`);

// products table
db.run(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    image TEXT
)
`);

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        () => {
            res.send("User registered");
        }
    );
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, row) => {
            if (row) {
                res.json({ success: true, user: row });
            } else {
                res.json({ success: false });
            }
        }
    );
});

// ADD PRODUCT
app.post("/add-product", upload.single("image"), (req, res) => {
    const { name, price } = req.body;

    let image = null;
    if (req.file) {
        image = req.file.filename;
    }

    db.run(
        "INSERT INTO products (name, price, image) VALUES (?, ?, ?)",
        [name, price, image],
        () => {
            res.send("Product added");
        }
    );
});

// GET PRODUCTS
app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        res.json(rows);
    });
});

// DELETE
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM products WHERE id = ?", [id], () => {
        res.send("Deleted");
    });
});

app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});