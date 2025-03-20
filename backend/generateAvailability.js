const express = require('express');
const router = express.Router();
const db = require('./db'); // Database connection

// ✅ Generate Availability Slots for Upcoming Dates
router.post('/generate-availability', async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Get all facilities
        const facilities = await connection.query(`SELECT id, max_pax FROM facilities`);

        // Generate slots for the next 14 days
        const today = new Date();
        const futureDates = Array.from({ length: 14 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i); // Future date
            return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        });

        for (const facility of facilities) {
            const maxPax = facility.max_pax || 50;

            for (const date of futureDates) {
                await connection.query(`
                    INSERT INTO facility_availability (facility_id, date, start_time, end_time, status, max_pax)
                    VALUES 
                    (?, ?, '08:00:00', '12:00:00', 'Available', ?),
                    (?, ?, '14:00:00', '18:00:00', 'Available', ?)
                    ON DUPLICATE KEY UPDATE max_pax = VALUES(max_pax)
                `, [facility.id, date, maxPax, facility.id, date, maxPax]);
            }
        }

        await connection.commit();
        console.log("✅ Availability slots successfully generated.");
        res.status(200).json({ message: "Availability slots successfully generated for the next 14 days." });

    } catch (error) {
        await connection.rollback();
        console.error("❌ Error generating availability slots:", error);
        res.status(500).json({ message: "Failed to generate availability slots. Please try again." });
    } finally {
        connection.release();
    }
});

module.exports = router;
