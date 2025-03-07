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
app.use(bodyParser.json());
app.use(cors());

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

// 📌 Signup Route
app.post("/signup", async (req, res) => {
    const { mobile, email, password, address, unit_number } = req.body;

    // 📌 Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // 📌 Validate Malaysian Mobile Number Format (Starts with 01X)
    const mobileRegex = /^01\d{8,9}$/;
    if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ message: "Invalid mobile number format. Use Malaysian format (e.g., 0123456789)." });
    }

    // 📌 Validate Password Strength
    if (password.length < 5) {
        return res.status(400).json({ message: "Password must be at least 5 characters long." });
    }

    // 📌 Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📌 Insert User into Database
    const sql = "INSERT INTO users (mobile, email, password_hash, address, unit_number) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [mobile, email, hashedPassword, address, unit_number], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error registering user", error: err });
        }
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// 📌 Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // 📌 Check if user exists
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 📌 Compare passwords
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 📌 Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, mobile: user.mobile },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        res.status(200).json({ message: "Login successful!", token });
    });
});

app.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});

// 📌 Start Server
app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});
