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

router.get('/get-announcements', (req, res) => {
    const sql = `SELECT id, subject AS title, message, createdAt AS date FROM messages WHERE type = 'announcement' ORDER BY createdAt DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Failed to fetch announcements:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch announcements." });
        }
        res.status(200).json(results);
    });
});

// ✅ DELETE - Permanently delete an announcement by ID
router.delete('/delete-announcement/:id', (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM messages WHERE id = ? AND type = 'announcement'`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Failed to delete announcement:", err);
            return res.status(500).json({ success: false, message: "Failed to delete announcement." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Announcement not found." });
        }

        return res.status(200).json({ success: true, message: "Announcement deleted successfully." });
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

    // 🔍 Ensure `type` is one of the accepted values
    if (!['user', 'admin', 'announcement'].includes(type)) {
        console.log("❌ Invalid 'type' value:", type);
        return res.status(400).json({ success: false, message: "Invalid 'type' value." });
    }

    // ✅ Broadcast announcement to all approved users
    if (type === 'announcement' && recipient === 'all') {
        const getUsersSql = `SELECT email FROM users WHERE status = 'Approved'`;
        db.query(getUsersSql, (err, users) => {
            if (err) {
                console.error("❌ Failed to fetch users:", err);
                return res.status(500).json({ success: false, message: "Failed to retrieve users." });
            }

            const insertSql = `INSERT INTO messages (recipient, sender, subject, message, status, type) VALUES ?`;
            const values = users.map(user => [user.email, sender, subject, message, 'Unread', 'announcement']);

            db.query(insertSql, [values], (insertErr) => {
                if (insertErr) {
                    console.error("❌ Insert error for announcement:", insertErr);
                    return res.status(500).json({ success: false, message: "Failed to send announcement." });
                }

                return res.status(201).json({ success: true, message: "Announcement sent to all users!" });
            });
        });
        return;
    }

    // ✅ Only check for `messageId` if it's a reply
    if (type === 'admin' && !messageId) {
        console.log("❌ Missing messageId for reply");
        return res.status(400).json({ success: false, message: "Message ID is required for replies." });
    }

    // 🛡️ Step 0: Prevent Duplicate Invitation Logic
    if (subject === 'Membership Invitation') {
        try {
            const getUsersSql = `SELECT id, email FROM users WHERE email IN (?, ?)`;
            db.query(getUsersSql, [sender, recipient], (err, users) => {
                if (err || users.length !== 2) {
                    return res.status(404).json({ success: false, message: "User(s) not found." });
                }

                const senderUser = users.find(u => u.email === sender);
                const recipientUser = users.find(u => u.email === recipient);

                const senderId = senderUser.id;
                const recipientId = recipientUser.id;

                // 🔢 Step 1: Check if sender already has 8 members
                const checkMemberCountSql = `SELECT COUNT(*) AS total FROM user_members WHERE user_id = ?`;
                db.query(checkMemberCountSql, [senderId], (countErr, countResult) => {
                    if (countErr) {
                        return res.status(500).json({ success: false, message: "Error checking member count." });
                    }

                    const memberCount = countResult[0].total;
                    if (memberCount >= 8) {
                        return res.status(400).json({ success: false, message: "You've reached the maximum number of members (8)." });
                    }

                    // 🔁 Proceed with existing checks
                    const checkMembersSql = `SELECT * FROM user_members WHERE user_id = ? AND member_id = ?`;
                    db.query(checkMembersSql, [senderId, recipientId], (memberErr, memberResult) => {
                        if (memberErr) {
                            return res.status(500).json({ success: false, message: "Error checking member status." });
                        }

                        if (memberResult.length > 0) {
                            return res.status(400).json({ success: false, message: "You are already members." });
                        }

                        const checkInviteSql = `SELECT * FROM messages WHERE sender = ? AND recipient = ? AND subject = ? AND status = 'Unread'`;
                        db.query(checkInviteSql, [sender, recipient, 'Membership Invitation'], (inviteErr, inviteResult) => {
                            if (inviteErr) {
                                return res.status(500).json({ success: false, message: "Error checking existing invitation." });
                            }

                            if (inviteResult.length > 0) {
                                return res.status(400).json({ success: false, message: "Invitation already sent and pending." });
                            }

                            // ✅ Proceed to insert
                            proceedToInsert();
                        });
                    });
                });
            });

            // Wrap the insert logic here so it's only called after all checks pass
            function proceedToInsert() {
                const insertSql = `INSERT INTO messages (recipient, sender, subject, message, status, type)
                                    VALUES (?, ?, ?, ?, ?, ?)`;
                const insertValues = [recipient, sender, subject, message, 'Unread', type];

                db.query(insertSql, insertValues, (insertErr, insertResult) => {
                    if (insertErr) {
                        return res.status(500).json({ success: false, message: "Failed to send invitation." });
                    }

                    return res.status(201).json({ success: true, message: "Membership invitation sent successfully." });
                });
            }

            // Prevent duplicate insert outside the callback chain
            return;

        } catch (err) {
            console.error("❌ Error checking existing invitation:", err);
            return res.status(500).json({ success: false, message: "Server error during invitation check." });
        }
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
                 AND status NOT IN ('Accepted', 'Rejected')  -- ✅ Exclude already handled invites
                 ORDER BY createdAt DESC`;

    db.query(sql, [recipientEmail, recipientEmail], (err, results) => {
        if (err) {
            console.error("❌ Failed to fetch notifications:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch notifications." });
        }
        res.status(200).json(results);
    });
});

router.post("/add-member", async (req, res) => {
    const { senderEmail, userEmail } = req.body;

    if (!senderEmail || !userEmail) {
        return res.status(400).json({ success: false, message: "Both emails are required." });
    }

    try {
        const getUsersSql = `SELECT id, email FROM users WHERE email IN (?, ?)`;
        db.query(getUsersSql, [senderEmail, userEmail], (err, users) => {
            if (err) {
                console.error("❌ Error fetching user IDs:", err);
                return res.status(500).json({ success: false, message: "Server error." });
            }

            if (users.length !== 2) {
                return res.status(404).json({ success: false, message: "One or both users not found." });
            }

            const sender = users.find(u => u.email === senderEmail);
            const recipient = users.find(u => u.email === userEmail);

            const insertSql = `
                INSERT IGNORE INTO user_members (user_id, member_id)
                VALUES (?, ?), (?, ?)
            `;

            db.query(insertSql, [sender.id, recipient.id, recipient.id, sender.id], (insertErr) => {
                if (insertErr) {
                    console.error("❌ Error inserting member:", insertErr);
                    return res.status(500).json({ success: false, message: "Failed to add members." });
                }

                return res.status(200).json({ success: true, message: "Members connected successfully." });
            });
        });
    } catch (error) {
        console.error("❌ Unexpected error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

router.get("/get-members", (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Get user ID by email
    const getUserSql = `SELECT id FROM users WHERE email = ?`;
    db.query(getUserSql, [email], (err, userResult) => {
        if (err || userResult.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const userId = userResult[0].id;

        // Now get member details
        const getMembersSql = `
            SELECT u.name, u.email, u.mobile FROM user_members um
            JOIN users u ON um.member_id = u.id
            WHERE um.user_id = ?
        `;

        db.query(getMembersSql, [userId], (err, members) => {
            if (err) {
                console.error("❌ Failed to fetch members:", err);
                return res.status(500).json({ success: false, message: "Server error." });
            }

            res.status(200).json(members);
        });
    });
});

// ✅ Accept Invitation & Add to user_members
router.post('/accept-invite', async (req, res) => {
    const { sender, recipient } = req.body;

    if (!sender || !recipient) {
        return res.status(400).json({ success: false, message: "Sender and recipient emails are required." });
    }

    try {
        // Step 1: Get both users
        const [senderResult] = await db.query(`SELECT id FROM users WHERE email = ?`, [sender]);
        const [recipientResult] = await db.query(`SELECT id FROM users WHERE email = ?`, [recipient]);

        if (!senderResult || !recipientResult) {
            return res.status(404).json({ success: false, message: "User(s) not found." });
        }

        const senderId = senderResult.id;
        const recipientId = recipientResult.id;

        // Step 2: Insert both directions into user_members
        const insertSql = `
            INSERT IGNORE INTO user_members (user_id, member_id)
            VALUES (?, ?), (?, ?)
        `;

        await db.query(insertSql, [senderId, recipientId, recipientId, senderId]);

        return res.status(200).json({ success: true, message: "Members connected successfully." });
    } catch (err) {
        console.error("❌ Error accepting invite:", err);
        return res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

router.post("/delete-member", (req, res) => {
    const { userEmail, memberEmail } = req.body;

    if (!userEmail || !memberEmail) {
        return res.status(400).json({ success: false, message: "Emails are required." });
    }

    const getIdsSql = `SELECT id, email FROM users WHERE email IN (?, ?)`;
    db.query(getIdsSql, [userEmail, memberEmail], (err, users) => {
        if (err || users.length !== 2) {
            return res.status(404).json({ success: false, message: "User(s) not found." });
        }

        const userId = users.find(u => u.email === userEmail).id;
        const memberId = users.find(u => u.email === memberEmail).id;

        const deleteSql = `
            DELETE FROM user_members
            WHERE (user_id = ? AND member_id = ?)
               OR (user_id = ? AND member_id = ?)
        `;

        db.query(deleteSql, [userId, memberId, memberId, userId], (deleteErr) => {
            if (deleteErr) {
                console.error("❌ Delete member error:", deleteErr);
                return res.status(500).json({ success: false, message: "Failed to remove member." });
            }

            return res.status(200).json({ success: true, message: "Member removed successfully." });
        });
    });
});

module.exports = router;
