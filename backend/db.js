const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost", // Change if using a remote database
    user: "John", // Replace with your MySQL username
    password: "John@2003", // Replace with your MySQL password
    database: "condonexus", // Your database name
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database!");
    }
});

module.exports = db;
