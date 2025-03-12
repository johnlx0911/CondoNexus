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

// ✅ New GET Route - Fetch Resident Messages Only
router.get('/get-resident-messages', (req, res) => {
    const sql = `SELECT * FROM messages WHERE type != 'admin' ORDER BY createdAt DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Failed to fetch resident messages." });
        }
        res.status(200).json(results);
    });
});

// ✅ POST - Send Message
router.post('/send-message', async (req, res) => {
    const { recipient, sender, subject, message, timestamp, type, messageId } = req.body;  // Added `messageId`

    console.log("🟠 Received Data:", req.body);

    if (!recipient || !sender || !subject || !message || !type || !messageId) {
        console.log("❌ Missing fields in request");
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const formattedTimestamp = new Date(timestamp || new Date())
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    // ✅ Step 1: Check if this is a reply to an existing message
    const checkSql = `SELECT * FROM messages WHERE id = ?`;
    const checkValues = [messageId];

    db.query(checkSql, checkValues, (checkErr, checkResults) => {
        if (checkErr) {
            console.error("❌ Database Error:", checkErr);
            return res.status(500).json({ success: false, message: "Database error during check." });
        }

        if (checkResults.length > 0) {
            // ✅ Step 2: Update the original message's status to 'Replied'
            const updateSql = `UPDATE messages SET status = 'Replied' WHERE id = ?`;
            const updateValues = [checkResults[0].id];

            db.query(updateSql, updateValues, (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("❌ Update Error:", updateErr);
                    return res.status(500).json({ success: false, message: "Failed to update message status." });
                }

                console.log("✅ Message marked as 'Replied'");

                // ✅ Step 3: Insert a new reply message as 'Unread'
                const insertSql = `INSERT INTO messages (recipient, sender, subject, message, status, createdAt, type) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

                const insertValues = [
                    recipient,
                    sender,
                    subject,
                    message,
                    'Unread', // ✅ Reply appears as Unread in NotificationPage
                    formattedTimestamp,
                    'admin' // ✅ Marks this message as an admin reply
                ];

                db.query(insertSql, insertValues, (insertErr, insertResult) => {
                    if (insertErr) {
                        console.error("❌ Insert Error:", insertErr);
                        return res.status(500).json({ success: false, message: "Failed to send reply." });
                    }

                    console.log("✅ New Reply Inserted Successfully");
                    res.status(201).json({ success: true, message: "Reply sent successfully." });
                });
            });
        } else {
            return res.status(404).json({ success: false, message: "Original message not found." });
        }
    });
});

// ✅ GET - Retrieve Messages
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
