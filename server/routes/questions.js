// server/routes/questions.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all questions (GAD + PHQ) [admin only]
router.get('/', auth, async (req, res) => {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  if (user.rows[0].role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const result = await pool.query('SELECT id, text, is_active, type FROM questions ORDER BY id');
  res.json(result.rows);
});

// Toggle question status (GAD or PHQ)
router.patch('/:id', auth, async (req, res) => {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  if (user.rows[0].role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const q = await pool.query(
    'UPDATE questions SET is_active = NOT is_active WHERE id = $1 RETURNING id, text, is_active, type',
    [req.params.id]
  );
  res.json(q.rows[0]);
});

// Get only active GAD or PHQ questions for employees
router.get('/active', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT id, text, is_active, type FROM questions WHERE is_active = TRUE ORDER BY id'
  );
  res.json(result.rows);
});

// Optional: Add a new question
router.post('/', auth, async (req, res) => {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  if (user.rows[0].role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const { text, type } = req.body;
  const result = await pool.query(
    'INSERT INTO questions (text, type, is_active) VALUES ($1, $2, TRUE) RETURNING id, text, is_active, type',
    [text, type]
  );
  res.json(result.rows[0]);
});

module.exports = router;
