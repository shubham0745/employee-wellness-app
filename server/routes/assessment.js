const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const generateReport = require('../utils/generateReport');

const router = express.Router();

// POST https://employee-wellness-app.onrender.com/api/assessment - Save assessment (GAD or PHQ)
router.post('/', auth, async (req, res) => {
  const userId = req.user.id;
  let { answers, total_score, type = 'GAD-7' } = req.body;
  type = type.trim();

  if (!answers || typeof total_score !== 'number') {
    return res.status(400).json({ msg: 'Missing answers or total_score' });
  }

  if (!['GAD-7', 'PHQ-9'].includes(type)) {
    return res.status(400).json({ msg: 'Invalid assessment type' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertAssessment = await client.query(
      'INSERT INTO assessments (user_id, total_score, type) VALUES ($1, $2, $3) RETURNING id',
      [userId, total_score, type]
    );

    const assessmentId = insertAssessment.rows[0].id;

    const insertAnswersPromises = Object.entries(answers).map(([questionId, value]) =>
      client.query(
        'INSERT INTO assessment_answers (assessment_id, question_id, answer_value) VALUES ($1, $2, $3)',
        [assessmentId, questionId, value]
      )
    );

    await Promise.all(insertAnswersPromises);
    await client.query('COMMIT');

    res.status(201).json({ msg: 'Assessment saved' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Assessment save error:', err.message);
    res.status(500).json({ msg: 'Failed to save assessment' });
  } finally {
    client.release();
  }
});

// GET https://employee-wellness-app.onrender.com/api/assessment/today?type=GAD|PHQ - Check if assessment submitted today
router.get('/today', auth, async (req, res) => {
  const userId = req.user.id;
  const type = req.query.type || 'GAD-7';
  const today = moment().startOf('day').toISOString();

  const result = await pool.query(
    'SELECT 1 FROM assessments WHERE user_id = $1 AND type = $2 AND created_at >= $3 LIMIT 1',
    [userId, type, today]
  );

  res.json({ submitted: result.rows.length > 0 });
});

// GET https://employee-wellness-app.onrender.com/api/assessment/history?type=GAD|PHQ - Assessment history by type
router.get('/history', auth, async (req, res) => {
  const userId = req.user.id;
  const type = req.query.type || 'GAD-7';

  const result = await pool.query(
    'SELECT total_score, created_at FROM assessments WHERE user_id = $1 AND type = $2 ORDER BY created_at',
    [userId, type]
  );

  res.json(result.rows);
});

// GET https://employee-wellness-app.onrender.com/api/assessment/report - Download Apple Health-style report
router.get('/report', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const userRes = await pool.query('SELECT name, date_of_birth FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];

    const gadData = await pool.query(
      `SELECT q.text AS question, a.answer_value
       FROM assessments ass
       JOIN assessment_answers a ON ass.id = a.assessment_id
       JOIN questions q ON a.question_id = q.id
       WHERE ass.user_id = $1 AND ass.type = 'GAD-7'
       ORDER BY ass.created_at DESC LIMIT 7`,
      [userId]
    );

   // ✅ In `/report` route: fix PHQ type mismatch
const phqData = await pool.query(
  `SELECT q.text AS question, a.answer_value
   FROM assessments ass
   JOIN assessment_answers a ON ass.id = a.assessment_id
   JOIN questions q ON a.question_id = q.id
   WHERE ass.user_id = $1 AND ass.type = 'PHQ-9'  -- ✅ fixed here
   ORDER BY ass.created_at DESC LIMIT 9`,
  [userId]
);

    const gadScore = gadData.rows.reduce((sum, row) => sum + parseInt(row.answer_value), 0);
    const phqScore = phqData.rows.reduce((sum, row) => sum + parseInt(row.answer_value), 0);
    const averageScore = Math.round((gadScore + phqScore) / 2); // ✅ Use this instead of customScore

    const moodMap = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

    const gadAnswers = gadData.rows.map(r => ({
      question: r.question,
      responseText: moodMap[r.answer_value]
    }));

    const phqAnswers = phqData.rows.map(r => ({
      question: r.question,
      responseText: moodMap[r.answer_value]
    }));

    // ✅ Generate the PDF
    const doc = generateReport(user, gadAnswers, phqAnswers, gadScore, phqScore, averageScore);

    // ✅ Set headers first
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=assessment_report.pdf');

    // ✅ Pipe to response and finalize
    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error('❌ PDF generation error:', err.message);
    res.status(500).json({ msg: 'Failed to generate report' });
  }
});

// ✅ GET https://employee-wellness-app.onrender.com/api/assessment/all - Admin-only: View full employee assessment history
router.get('/all', auth, async (req, res) => {
  try {
    const user = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
    if (user.rows[0].role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
      }

    const result = await pool.query(`
      SELECT 
        a.id,
        u.name AS employee_name,
        a.created_at AS date,
        a.type,
        a.total_score AS score
      FROM assessments a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC;
    `);

    // Dynamically compute severity
    const withSeverity = result.rows.map(row => {
      let severity = 'None';
      if (row.type === 'GAD-7') {
        if (row.score >= 15) severity = 'Severe';
        else if (row.score >= 10) severity = 'Moderate';
        else if (row.score >= 5) severity = 'Mild';
      } else if (row.type === 'PHQ-9') {  // ✅ fixed here
  if (row.score >= 20) severity = 'Severe';
  else if (row.score >= 15) severity = 'Moderately Severe';
  else if (row.score >= 10) severity = 'Moderate';
  else if (row.score >= 5) severity = 'Mild';
}
      return { ...row, severity };
    });

    res.json(withSeverity);
  } catch (err) {
    console.error('❌ Failed to fetch admin assessment history:', err.message);
    res.status(500).json({ msg: 'Failed to fetch history' });
  }
});

module.exports = router;
