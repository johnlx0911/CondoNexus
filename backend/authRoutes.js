const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("./db"); // ✅ MySQL database connection
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const router = express.Router();
const resetTokens = {}; // Store tokens temporarily (use DB in production)

// ✅ Configure SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// **Forgot Password - Generate & Send Reset Link**
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    db.query("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", [email.trim()], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        resetTokens[token] = email;

        const resetLink = `http://yourapp.com/reset-password?token=${token}`;
        console.log("✅ Reset Link Generated:", resetLink);

        // ✅ Send email using SendGrid (instead of Nodemailer)
        const msg = {
            to: email,
            from: "leexing0911@gmail.com", // ✅ Must be the verified sender
            subject: "Password Reset",
            text: `Click here to reset your password: ${resetLink}`,
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        try {
            await sgMail.send(msg);
            console.log("✅ Email sent successfully!");
            res.json({ message: "Reset password link sent!" });
        } catch (error) {
            console.error("❌ Email sending error:", error);
            res.status(500).json({ message: "Failed to send reset email", error });
        }
    });
});

// **Reset Password - Verify Token & Update Password**
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    const email = resetTokens[token];

    if (!email) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update password in MySQL
    db.query("UPDATE users SET password_hash = ? WHERE email = ?", [hashedPassword, email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error updating password", error: err });
        }

        delete resetTokens[token]; // Remove used token
        res.json({ message: "Password updated successfully!" });
    });
});

module.exports = router;
