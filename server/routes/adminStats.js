// server/routes/adminStats.js
const express = require('express');
const pool = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// GET /api/admin/stats/overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const totalEmployees = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'employee'");
    const gadSubmissions = await pool.query("SELECT COUNT(*) FROM assessments WHERE type = 'GAD-7'");
    const phqSubmissions = await pool.query("SELECT COUNT(*) FROM assessments WHERE type = 'PHQ-9'");
    const moodEntries = await pool.query("SELECT COUNT(*) FROM mood_entries");

    res.json({
      totalEmployees: parseInt(totalEmployees.rows[0].count),
      gadSubmissions: parseInt(gadSubmissions.rows[0].count),
      phqSubmissions: parseInt(phqSubmissions.rows[0].count),
      moodEntries: parseInt(moodEntries.rows[0].count),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/admin/stats/severity
router.get('/severity', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        CASE 
          WHEN total_score <= 5 THEN 'Mild'
          WHEN total_score <= 10 THEN 'Moderate'
          WHEN total_score <= 15 THEN 'Moderately Severe'
          ELSE 'Severe'
        END AS severity,
        COUNT(*) 
      FROM assessments 
      WHERE type IN ('GAD-7', 'PHQ-9') 
      GROUP BY severity
    `);

    const formatted = result.rows.map(row => ({
      name: row.severity,
      y: parseInt(row.count)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error in severity stats:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// GET /api/admin/stats/daily-submissions
router.get('/stats/daily-submissions', authenticateToken, async (req, res) => {
  try {
    const submissionTrendRes = await pool.query(`
      SELECT
        TO_CHAR(created_at AT TIME ZONE 'Asia/Kolkata', 'DD/MM/YYYY') AS date,
        SUM(CASE WHEN type = 'GAD-7' THEN 1 ELSE 0 END) AS gad7_count,
        SUM(CASE WHEN type = 'PHQ-9' THEN 1 ELSE 0 END) AS phq9_count
      FROM assessments
      GROUP BY date
      ORDER BY MIN(created_at)
    `);

    res.json(submissionTrendRes.rows);
  } catch (err) {
    console.error('Error fetching daily submissions:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// GET /api/admin/stats/mood-distribution
router.get('/mood-distribution', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.label AS mood, COUNT(*) 
      FROM mood_entries me 
      JOIN moods m ON me.mood_id = m.id 
      GROUP BY m.label 
      ORDER BY COUNT(*) DESC;
    `);

    const formatted = result.rows.map(row => ({
      label: row.mood,
      count: parseInt(row.count)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error in mood-distribution:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

/// GET /api/admin/stats/average-scores
router.get('/average-scores', authenticateToken, async (req, res) => {
  try {
    const avgScoreRes = await pool.query(`
      SELECT 
        (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date AS date,
        ROUND(AVG(CASE WHEN type = 'GAD-7' THEN total_score END), 2) AS avg_gad7_score,
        ROUND(AVG(CASE WHEN type = 'PHQ-9' THEN total_score END), 2) AS avg_phq9_score
      FROM assessments
      GROUP BY date
      ORDER BY date;
    `);

    res.json(avgScoreRes.rows);
  } catch (err) {
    console.error('Error fetching average scores:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
