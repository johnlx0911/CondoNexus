const express = require('express');
const router = express.Router();
const db = require('./db'); // Import your MySQL connection

// POST - Send Message
router.post('/send-message', (req, res) => {
    const { sender, subject, message } = req.body;

    if (!sender || !subject || !message) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = `INSERT INTO messages (sender, subject, message) VALUES (?, ?, ?)`;
    db.query(sql, [sender, subject, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to send message." });
        }
        res.status(200).json({ success: true, message: "Message sent successfully!" });
    });
});

// GET - Retrieve Messages
router.get('/get-messages', (req, res) => {
    const sql = `SELECT * FROM messages ORDER BY createdAt DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to fetch messages." });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
