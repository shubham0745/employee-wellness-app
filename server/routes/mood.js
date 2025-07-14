// server/routes/mood.js
const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// POST https://employee-wellness-app.onrender.com/api/mood - Save a mood entry (emoji or label)
router.post('/', authenticateToken, async (req, res) => {
  const { mood } = req.body;
  const userId = req.user.id;

  if (!mood || typeof mood !== 'string') {
    return res.status(400).json({ msg: 'Mood is required as emoji or label' });
  }

  try {
    // 1. First, try to match by label (case-insensitive)
    let moodRes = await pool.query(
      'SELECT id FROM moods WHERE LOWER(label) = LOWER($1)',
      [mood]
    );

    // 2. If no label match, try matching by mood emoji
    if (moodRes.rows.length === 0) {
      moodRes = await pool.query(
        'SELECT id FROM moods WHERE mood = $1',
        [mood]
      );
    }

    if (moodRes.rows.length === 0) {
      return res.status(400).json({ msg: 'Mood not recognized' });
    }

    const moodId = moodRes.rows[0].id;

    // 3. Insert into mood_entries
    await pool.query(
      'INSERT INTO mood_entries (user_id, mood_id, created_at) VALUES ($1, $2, NOW())',
      [userId, moodId]
    );

    res.json({ msg: 'Mood recorded successfully' });
  } catch (err) {
    console.error('❌ Mood save error:', err.message);
    res.status(500).json({ msg: 'Failed to save mood' });
  }
});

// GET https://employee-wellness-app.onrender.com/api/mood - Fetch mood history (return only mood emoji and timestamp)
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  // Mapping labels to emojis (for old entries stored with label only)
  const labelToEmoji = {
    'Happy': '😄',
    'Calm': '🙂',
    'Neutral': '😐',
    'Sad': '😔',
    'Angry': '😡',
  };

  try {
    const result = await pool.query(`
      SELECT m.mood, m.label, me.created_at
      FROM mood_entries me
      JOIN moods m ON me.mood_id = m.id
      WHERE me.user_id = $1
      ORDER BY me.created_at
    `, [userId]);

    // Normalize output to always return `mood` as emoji
    const moodHistory = result.rows.map(entry => ({
      created_at: entry.created_at,
      mood: entry.mood || labelToEmoji[entry.label] || '😐'  // fallback
    }));

    res.json(moodHistory);
  } catch (err) {
    console.error('❌ Mood fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

module.exports = router;
