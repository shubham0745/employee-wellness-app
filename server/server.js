const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const questionRoutes = require('./routes/questions');
const moodRoutes = require('./routes/mood');
const adminRoutes = require('./routes/admin');
const adminStatsRoute = require('./routes/adminStats');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('https://employee-wellness-app.onrender.com/api/auth', authRoutes);
app.use('https://employee-wellness-app.onrender.com/api/assessment', assessmentRoutes);
app.use('https://employee-wellness-app.onrender.com/api/questions', questionRoutes);
app.use('https://employee-wellness-app.onrender.com/api/mood', moodRoutes);
app.use('https://employee-wellness-app.onrender.com/api/admin', adminRoutes);
app.use('https://employee-wellness-app.onrender.com/api/admin/stats', adminStatsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
