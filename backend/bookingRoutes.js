const express = require('express');
const router = express.Router();
const db = require('./db');
const rateLimit = require('express-rate-limit');

// ✅ Rate Limiter for Booking Endpoint
const bookingLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,              // Max 5 requests per minute
    message: "Too many booking attempts. Please try again later."
});

// ✅ Date & Time Format Validation
const isValidTimeFormat = (time) => {
    return /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time);  // Matches 'HH:mm:ss'
};

// ✅ Confirm Booking Endpoint
router.post('/confirm-booking', async (req, res) => {
    const { user_id, facility_id, booking_date, start_time, end_time, num_pax } = req.body;

    const MAX_PAX = 10; // 🔐 Maximum pax per slot

    console.log(`📤 Incoming Booking Request:`, req.body);

    const today = new Date();
    const bookingDateObj = new Date(booking_date);
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const bookingDateOnly = new Date(bookingDateObj.getFullYear(), bookingDateObj.getMonth(), bookingDateObj.getDate());

    if (bookingDateOnly < todayDateOnly) {
        console.log("❌ Booking Date Failed (Past Date Detected)");
        return res.status(400).json({ message: "Booking failed. Cannot book past dates." });
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error("❌ Transaction Error:", err);
            return res.status(500).json({ message: "Server error. Please try again later." });
        }

        // ✅ Check if facility is closed
        db.query(`
            SELECT * FROM facility_availability
            WHERE facility_id = ? AND date = ? FOR UPDATE
        `, [facility_id, booking_date], (err, availability) => {
            if (err) {
                db.rollback(() => console.error("❌ Availability Check Failed:", err));
                return res.status(500).json({ message: "Server error. Please try again later." });
            }

            if (availability.length > 0 && availability[0].status === 'Closed') {
                db.rollback(() => console.log("❌ Facility Closed for Maintenance"));
                return res.status(400).json({ message: "Facility is closed for maintenance." });
            }

            // ✅ Check if user already has a booking that day
            db.query(`
                SELECT * FROM bookings
                WHERE user_id = ? AND facility_id = ? AND booking_date = ?
            `, [user_id, facility_id, booking_date], (err, existingUserBooking) => {
                if (err) {
                    db.rollback(() => console.error("❌ Error Checking Existing Booking:", err));
                    return res.status(500).json({ message: "Server error. Please try again later." });
                }

                if (existingUserBooking.length > 0) {
                    db.rollback(() => console.log("❌ Duplicate Booking Detected"));
                    return res.status(400).json({ message: "You already have a booking for this facility on this date." });
                }

                // ✅ NEW: Check if time slot has reached MAX_PAX
                db.query(`
                    SELECT SUM(num_pax) AS total_pax
                    FROM bookings
                    WHERE facility_id = ? AND booking_date = ? AND start_time = ? AND status = 'Confirmed'
                `, [facility_id, booking_date, start_time], (err, results) => {
                    if (err) {
                        db.rollback(() => console.error("❌ Slot Pax Check Failed:", err));
                        return res.status(500).json({ message: "Server error. Please try again later." });
                    }

                    const totalPax = results[0].total_pax || 0;
                    if (totalPax + num_pax > MAX_PAX) {
                        db.rollback(() => console.log("❌ Slot Fully Booked"));
                        return res.status(400).json({ message: "This time slot is fully booked. Please choose another one." });
                    }

                    // ✅ Proceed with booking
                    db.query(`
                        INSERT INTO bookings (user_id, facility_id, booking_date, start_time, end_time, num_pax, status)
                        VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
                    `, [user_id, facility_id, booking_date, start_time, end_time, num_pax], (err) => {
                        if (err) {
                            db.rollback(() => console.error("❌ Error Inserting Booking:", err));
                            return res.status(500).json({ message: "Server error. Please try again later." });
                        }

                        db.commit((err) => {
                            if (err) {
                                db.rollback(() => console.error("❌ Commit Failed:", err));
                                return res.status(500).json({ message: "Server error. Please try again later." });
                            }

                            console.log(`✅ Booking confirmed for User ID: ${user_id} on ${booking_date}`);
                            res.status(201).json({ message: "Booking confirmed successfully." });
                        });
                    });
                });
            });
        });
    });
});

// ✅ Cancel Booking Endpoint
router.post('/cancel-booking', async (req, res) => {
    const { user_id, facility_id, booking_date } = req.body;

    db.query(`
        SELECT * FROM bookings
        WHERE user_id = ? AND facility_id = ? AND booking_date = ?
    `, [user_id, facility_id, booking_date], (err, existingBooking) => {
        if (err) {
            console.error("Error checking booking status:", err);
            return res.status(500).json({ message: "Server error. Please try again later." });
        }

        if (existingBooking.length === 0) {
            return res.status(400).json({ message: "No booking found to cancel." });
        }

        if (existingBooking[0].user_id !== user_id) {
            return res.status(403).json({ message: "Unauthorized. You can only cancel your own bookings." });
        }

        db.query(`
            DELETE FROM bookings
            WHERE user_id = ? AND facility_id = ? AND booking_date = ?
        `, [user_id, facility_id, booking_date], (err) => {
            if (err) {
                console.error("❌ Error canceling booking:", err);
                return res.status(500).json({ message: "Server error. Please try again later." });
            }

            res.status(200).json({ message: "Booking canceled successfully." });
        });
    });
});

// ✅ Check Booking Status Endpoint
router.get('/check-booking-status', async (req, res) => {
    const { user_id, facility_id, booking_date } = req.query;

    console.log(`🟠 Received Request: user_id=${user_id}, facility_id=${facility_id}, booking_date=${booking_date}`);

    try {
        const existingBooking = await db.query(`
            SELECT * FROM bookings
            WHERE user_id = ? AND facility_id = ? AND booking_date = ?
        `, [user_id, facility_id, booking_date]);

        if (existingBooking.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking booking status:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// ✅ Get Booking Count Per Time Slot
router.get('/booking-count', async (req, res) => {
    const { facility_id, booking_date } = req.query;

    if (!facility_id || !booking_date) {
        return res.status(400).json({ message: "Missing parameters." });
    }

    const sql = `
        SELECT start_time, SUM(num_pax) as total_pax
        FROM bookings
        WHERE facility_id = ? AND booking_date = ? AND status = 'Confirmed'
        GROUP BY start_time
    `;

    db.query(sql, [facility_id, booking_date], (err, results) => {
        if (err) {
            console.error("❌ Error fetching booking counts:", err);
            return res.status(500).json({ message: "Failed to fetch data" });
        }

        res.status(200).json(results); // Array of { start_time, total_pax }
    });
});

// ✅ Admin Middleware
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized. Admin access required." });
    }
    next();
};

// ✅ Close Facility Endpoint
router.post('/close-facility', isAdmin, async (req, res) => {
    const { facility_id, maintenance_date } = req.body;

    try {
        await db.query(`
            INSERT INTO facility_availability (facility_id, date, status)
            VALUES (?, ?, 'Closed')
            ON DUPLICATE KEY UPDATE status = 'Closed'
        `, [facility_id, maintenance_date]);

        res.status(200).json({ message: "Facility successfully closed for maintenance." });

    } catch (error) {
        console.error("Error closing facility:", error);
        res.status(500).json({ message: "Failed to close facility for maintenance." });
    }
});

module.exports = router;
