const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// GET https://employee-wellness-app.onrender.com/api/admin/reminder-settings
router.get('/reminder-settings', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM reminder_settings ORDER BY id DESC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        mood_popup_1: '',
        mood_popup_2: '',
        water_interval_minutes: '',
        posture_interval_minutes: '',
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching reminder settings:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST https://employee-wellness-app.onrender.com/api/admin/reminder-settings
router.post('/reminder-settings', authenticateToken, async (req, res) => {
  let { mood_popup_1, mood_popup_2, water_interval_minutes, posture_interval_minutes } = req.body;

  try {
    mood_popup_1 = mood_popup_1?.trim() === '' ? null : mood_popup_1;
    mood_popup_2 = mood_popup_2?.trim() === '' ? null : mood_popup_2;
    water_interval_minutes = isNaN(parseInt(water_interval_minutes)) ? null : parseInt(water_interval_minutes);
    posture_interval_minutes = isNaN(parseInt(posture_interval_minutes)) ? null : parseInt(posture_interval_minutes);

    await db.query(
      `INSERT INTO reminder_settings (mood_popup_1, mood_popup_2, water_interval_minutes, posture_interval_minutes)
       VALUES ($1, $2, $3, $4)`,
      [mood_popup_1, mood_popup_2, water_interval_minutes, posture_interval_minutes]
    );

    res.json({ message: 'Settings saved successfully!' });
  } catch (err) {
    console.error('❌ Error saving reminder settings:', err.message);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// ✅ MOVE THESE OUTSIDE 👇

// GET https://employee-wellness-app.onrender.com/api/admin/employees
router.get('/employees', authenticateToken, async (req, res) => {
  try {
    const { state, city, designation, theme } = req.query;

    // Base query with updated column names + added age
    let query = `
      SELECT id, name, email, date_of_birth, age, theme, designation, state, city
      FROM users
      WHERE role = 'employee'
    `;
    const values = [];
    let count = 1;

    // Dynamically add filters
    if (state) {
      query += ` AND state = $${count++}`;
      values.push(state);
    }
    if (city) {
      query += ` AND city = $${count++}`;
      values.push(city);
    }
    if (designation) {
      query += ` AND designation = $${count++}`;
      values.push(designation);
    }
    if (theme) {
      query += ` AND theme = $${count++}`;
      values.push(theme);
    }

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching employees with filters:', err.message);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// GET https://employee-wellness-app.onrender.com/api/admin/employee-details/:id
router.get('/employee-details/:id', authenticateToken, async (req, res) => {
  const employeeId = req.params.id;

  try {
    const userRes = await db.query(`SELECT name FROM users WHERE id = $1`, [employeeId]);
    const name = userRes.rows[0]?.name || 'Unknown';

    const assessmentsRes = await db.query(`
      SELECT type, total_score AS score, created_at AS date,
      CASE
        WHEN type = 'GAD-7' AND total_score >= 15 THEN 'Severe'
        WHEN type = 'GAD-7' AND total_score >= 10 THEN 'Moderate'
        WHEN type = 'GAD-7' AND total_score >= 5 THEN 'Mild'
        WHEN type = 'PHQ-9' AND total_score >= 20 THEN 'Severe'
        WHEN type = 'PHQ-9' AND total_score >= 15 THEN 'Moderately Severe'
        WHEN type = 'PHQ-9' AND total_score >= 10 THEN 'Moderate'
        WHEN total_score >= 5 THEN 'Mild'
        ELSE 'None'
      END AS severity
      FROM assessments
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [employeeId]);

    const moodsRes = await db.query(`
  SELECT m.mood, me.created_at AS date
  FROM mood_entries me
  JOIN moods m ON me.mood_id = m.id
  WHERE me.user_id = $1
  ORDER BY me.created_at DESC
`, [employeeId]);

    res.json({
      name,
      assessments: assessmentsRes.rows,
      moods: moodsRes.rows,
    });
  } catch (err) {
    console.error('❌ Error fetching employee details:', err.message);
    res.status(500).json({ error: 'Failed to fetch details' });
  }
});

// GET https://employee-wellness-app.onrender.com/api/admin/stats/daily-submissions
router.get('/stats/daily-submissions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS ist_date,
        type,
        COUNT(*) AS submission_count
      FROM assessments
      GROUP BY ist_date, type
      ORDER BY ist_date
    `);

    const submissionMap = {};

    result.rows.forEach(row => {
      const date = row.ist_date;
      if (!submissionMap[date]) {
        submissionMap[date] = { date, gad7_count: 0, phq9_count: 0 };
      }
      if (row.type === 'GAD-7') {
        submissionMap[date].gad7_count = parseInt(row.submission_count);
      } else if (row.type === 'PHQ-9') {
        submissionMap[date].phq9_count = parseInt(row.submission_count);
      }
    });

    const finalData = Object.values(submissionMap);
    res.json(finalData);
  } catch (err) {
    console.error('❌ Error fetching daily submissions:', err.message);
    res.status(500).json({ msg: 'Error fetching submission data' });
  }
});

module.exports = router;
