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
    const { recipient, sender, subject, message, timestamp, type, messageId } = req.body;

    console.log("🟠 Received Data:", req.body);

    // 🔍 Check for Missing Fields
    if (!recipient || !sender || !subject || !message || !type) {
        console.log("❌ Missing fields in request");
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // 🔍 Ensure `type` is only 'user' or 'admin'
    if (type !== 'user' && type !== 'admin') {
        console.log("❌ Invalid 'type' value:", type);
        return res.status(400).json({ success: false, message: "Invalid 'type' value." });
    }

    // ✅ Only check for `messageId` if it's a reply
    if (type === 'admin' && !messageId) {
        console.log("❌ Missing messageId for reply");
        return res.status(400).json({ success: false, message: "Message ID is required for replies." });
    }

    // ✅ Step 1: Insert the New Message
    const insertSql = `INSERT INTO messages (recipient, sender, subject, message, status, type)
                        VALUES (?, ?, ?, ?, ?, ?);`;

    const insertValues = [
        recipient,
        sender,
        subject,
        message,
        'Unread', // ✅ Status as 'Unread'
        type       // ✅ Marks this message as either 'user' or 'admin'
    ];

    console.log("🟡 Inserting message with values:", insertValues);

    db.query(insertSql, insertValues, (insertErr, insertResult) => {
        if (insertErr) {
            console.error("❌ Insert Error Details:", insertErr.sqlMessage || insertErr);
            return res.status(500).json({ success: false, message: insertErr.sqlMessage || "Failed to send reply." });
        }

        console.log("✅ New Reply Inserted Successfully");

        // ✅ Step 2: If it's an admin reply, update the original message status
        if (type === 'admin' && messageId) {
            const updateSql = `UPDATE messages SET status = 'Replied' WHERE id = ?`;
            const updateValues = [messageId];

            db.query(updateSql, updateValues, (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("❌ Update Error:", updateErr);
                    return res.status(500).json({ success: false, message: "Failed to update message status." });
                }

                console.log("✅ Original Message marked as 'Replied'");
                return res.status(201).json({ success: true, message: "Reply sent successfully." });
            });
        } else {
            return res.status(201).json({ success: true, message: "Message sent successfully." });
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

// ✅ GET - Retrieve Messages for NotificationPage.tsx
router.get('/get-notifications', (req, res) => {
    const { recipientEmail } = req.query;

    if (!recipientEmail) {
        return res.status(400).json({ success: false, message: "Recipient email is required." });
    }

    const sql = `SELECT * FROM messages 
                 WHERE recipient = ? 
                 AND sender != ?  -- ✅ Exclude user-sent messages
                 ORDER BY createdAt DESC`;

    db.query(sql, [recipientEmail, recipientEmail], (err, results) => {
        if (err) {
            console.error("❌ Failed to fetch notifications:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch notifications." });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
