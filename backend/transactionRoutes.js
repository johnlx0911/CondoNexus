const express = require('express');
const router = express.Router();
const db = require('./db');

// ➕ Add a new transaction
router.post('/addTransaction', (req, res) => {
    const { user_id, month, amount, date_paid, payment_method } = req.body;

    const sql = `
    INSERT INTO transactions (user_id, month, amount, date_paid, payment_method)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(sql, [user_id, month, amount, date_paid, payment_method], (err, result) => {
        if (err) {
            console.error('Error inserting transaction:', err);
            return res.status(500).json({ message: 'Failed to save transaction' });
        }
        res.status(200).json({ message: 'Transaction saved successfully' });
    });
});

// 📦 Get all transactions for a specific user
router.get('/getTransactions/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `
    SELECT month, amount, DATE_FORMAT(date_paid, '%d %M') as date_paid
    FROM transactions
    WHERE user_id = ?
    ORDER BY date_paid DESC
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ message: 'Failed to fetch transactions' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
