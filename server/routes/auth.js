// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Register a new user with extended fields
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'employee',
    theme,
    designation,
    state,
    city,
    age,
    phone,
    ailments,
    height,
    weight,
    blood_group,
    date_of_birth
  } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users 
      (name, email, password, role, theme, designation, state, city, age, phone, ailments, height, weight, blood_group, date_of_birth) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *`,
      [
        name,
        email,
        hashedPassword,
        role,
        theme,
        designation,
        state,
        city,
        age,
        phone,
        ailments,
        height,
        weight,
        blood_group,
        date_of_birth
      ]
    );

    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current user
// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        name, email, role, date_of_birth, designation, phone, height, weight, ailments
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ msg: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching user profile:', err.message);
    res.status(500).json({ msg: 'Failed to fetch profile' });
  }
});

// Admin info route
router.get('/whoami', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error fetching user info:', err.message);
    res.status(500).json({ msg: 'Failed to fetch user info' });
  }
});

// POST https://employee-wellness-app.onrender.com/api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return res.status(404).json({ msg: 'Email not found' });

    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
      [token, expires, email]
    );

    const resetURL = `http://localhost:3000/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,   // Must be set in .env
        pass: process.env.EMAIL_PASS    // Use Gmail App Password
      }
    });

    const mailOptions = {
      from: '"Wellness App" <noreply@wellness.com>',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetURL}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Reset link sent to email.' });
  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // ✅ Debug logs
  console.log('🛠️ Reset token received:', token);
  console.log('🛠️ New password received:', newPassword);

  try {
    const userRes = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2',
      [token, new Date()]
    );

    // ✅ Log the DB result
    console.log('🧾 Token lookup result:', userRes.rows);

    if (userRes.rows.length === 0) {
      return res.status(400).json({ msg: 'Token is invalid or expired' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashed, userRes.rows[0].id]
    );

    res.json({ msg: 'Password has been reset successfully' });
  } catch (err) {
    console.error('❌ Reset password error:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Update editable profile fields
router.put('/update-profile', authMiddleware, async (req, res) => {
  const {
    designation,
    phone,
    height,
    weight,
    ailments
  } = req.body;

  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE users SET
        designation = $1,
        phone = $2,
        height = $3,
        weight = $4,
        ailments = $5
      WHERE id = $6`,
      [designation, phone, height, weight, ailments, userId]
    );

    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error while updating profile' });
  }
});

module.exports = router;
