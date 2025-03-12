const express = require('express');
const router = express.Router();
const db = require('./db'); // Import your MySQL connection

// ✅ PUT Route - Update Message Status
router.put('/update-status/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required." });
    }

    const sql = `UPDATE messages SET status = ? WHERE id = ?`;
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to update message status." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Message not found." });
        }

        res.status(200).json({ success: true, message: `Message status updated to "${status}".` });
    });
});

// POST - Send Message with Recipient and Type Field
router.post('/send-message', (req, res) => {
    const { recipient, sender, subject, message, timestamp, type } = req.body;

    if (!recipient || !sender || !subject || !message || !type) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const sql = `INSERT INTO messages (recipient, sender, subject, message, status, createdAt, type) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        recipient,
        sender,
        subject,
        message,
        'Unread',
        timestamp || new Date().toISOString(),
        type // "admin" or "user"
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to send message." });
        }
        res.status(201).json({ success: true, message: "Message sent successfully." });
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
