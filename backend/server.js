const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());
const fs = require("fs");

const uploadPath = path.join(__dirname, "uploads");

// create folder only if not exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
const db = new sqlite3.Database("database.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)
`);

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

app.get("/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM products WHERE id = ?", [id], () => {
        res.send("Deleted");
    });
});

app.use("/uploads", express.static("uploads"));