require("dotenv").config();
console.log("JWT Secret:", process.env.JWT_SECRET);
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // Import database connection

const app = express();
const authRoutes = require("./authRoutes"); // Import the new routes
app.use(express.json());
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Message Routes
const messageRoutes = require('./messageRoutes');
app.use('/api', messageRoutes);
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handleError = (res, status, message, error = null) => {
    console.error(`❌ ${message}`, error || "");
    res.status(status).json({ message, error });
};

// Use authentication routes
app.use("/api", authRoutes);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Received Authorization Header:", authHeader); // Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    // Extract only the token part after "Bearer "
    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token); // Debugging

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Continue to the next function
    } catch (err) {
        console.error("Token Verification Error:", err.message);
        res.status(400).json({ message: "Invalid Token." });
    }
};

// Create Payment Intent Route
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: "Invalid amount provided" });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount) * 100,  // Amount in cents
            currency: currency || 'myr',
            payment_method_types: ['card'],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: "Payment intent creation failed. Please try again." });
    }
});

// 📌 Signup Route
app.post("/signup", async (req, res) => {
    const { mobile, email, password, address, unit_number, name } = req.body; // Added 'name'

    // Ensure 'name' is validated
    if (!name) return handleError(res, 400, "Name is required.");

    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailSql, [email], async (err, results) => {
        if (err) return handleError(res, 500, "Database error during email check", err);
        if (results.length > 0) return handleError(res, 400, "Email already registered.");

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql = `
            INSERT INTO users (name, mobile, email, password_hash, address, unit_number, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertSql, [name, mobile, email, hashedPassword, address, unit_number, "Pending"], (err, result) => {
            if (err) return handleError(res, 500, "Error registering user", err);
            res.status(201).json({ message: "Signup request submitted. Await admin approval." });
        });
    });
});

// 📌 Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // 📌 Check if user status is "Pending"
        // Inside Login Route
        if (user.status === "Pending") {
            console.log(`🟠 Login Blocked: User '${user.email}' is still pending approval.`);
            return res.status(403).json({ message: "Account pending approval by admin." });
        }

        // 📌 Check if user status is "Inactive" or "Deleted"
        if (user.status === "Inactive" || user.status === "Deleted") {
            return res.status(403).json({ message: "Account is inactive. Contact support." });
        }

        // 📌 Ensure password exists before comparing
        if (!user.password_hash) {
            return res.status(500).json({ message: "User data error. Please contact support." });
        }

        // 📌 Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 📌 Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, mobile: user.mobile },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful!", token });
    });
});

app.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});

// 📌 Admin Approval Route
app.post("/approve-resident/:id", (req, res) => {
    const { id } = req.params;

    const checkUserSql = "SELECT status FROM users WHERE id = ?";
    db.query(checkUserSql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        const user = results[0];

        if (user.status === "Approved") {
            return res.status(200).json({ message: "User is already approved." });
        }

        const sql = "UPDATE users SET status = 'Approved' WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return res.status(500).json({ message: "Error approving user", error: err });
            res.status(200).json({ message: "User approved successfully!", success: true });
        });
    });
});

app.delete("/reject-resident/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error rejecting user", error: err });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User rejected successfully!", success: true });
    });
});


app.get("/residents", (req, res) => {
    const sql = "SELECT * FROM users WHERE status IN ('Pending', 'Approved')";
    db.query(sql, (err, results) => {
        if (err) {
            return handleError(res, 500, "Error fetching residents", err);
        }
        res.status(200).json(results);
    });
});

// 📌 Start Server
app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
