// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from '../components/PageLayout';
import styles from './AdminDashboard.module.css';
import { useNavigate } from 'react-router-dom';
import AdminStats from '../components/AdminStats';
import SeverityPieChart from '../components/SeverityPieChart';
import DailySubmissionsChart from '../components/DailySubmissionsChart';
import MoodDistributionChart from '../components/MoodDistributionChart';
import AverageScoreLineChart from '../components/AverageScoreLineChart';

const AdminDashboard = () => {
  const [gadQuestions, setGadQuestions] = useState([]);
  const [phqQuestions, setPhqQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [reminderSettings, setReminderSettings] = useState({
    mood_popup_1: '',
    mood_popup_2: '',
    water_interval_minutes: '',
    posture_interval_minutes: '',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('${process.env.REACT_APP_API_URL}/api/questions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGadQuestions(res.data.filter((q) => q.type?.trim().toUpperCase() === 'GAD-7'));
        setPhqQuestions(res.data.filter((q) => q.type?.trim().toUpperCase() === 'PHQ-9'));
      } catch (err) {
        console.error('Failed to load questions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [token]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('${process.env.REACT_APP_API_URL}/api/assessment/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssessmentHistory(res.data);
      } catch (err) {
        console.error('Failed to load assessment history', err);
      }
    };
    fetchHistory();
  }, [token]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get('${process.env.REACT_APP_API_URL}/api/admin/reminder-settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminderSettings(res.data);
      } catch (err) {
        console.error('Failed to load reminder settings', err);
      }
    };
    fetchReminders();
  }, [token]);

  const toggleQuestion = async (id) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/questions/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const update = (questions) =>
        questions.map((q) => q.id === id ? { ...q, is_active: res.data.is_active } : q);
      setGadQuestions((prev) => update(prev));
      setPhqQuestions((prev) => update(prev));
    } catch (err) {
      console.error('Failed to toggle question');
    }
  };

  const renderQuestionList = (questions) => (
    <ul className={styles['question-list']}>
      {questions.map((q) => (
        <li key={q.id} className={styles['question-item']}>
          <span><strong>{q.text}</strong></span>
          <label>
            <input
              type="checkbox"
              checked={q.is_active}
              onChange={() => toggleQuestion(q.id)}
            />
            &nbsp;Active
          </label>
        </li>
      ))}
    </ul>
  );

  const handleReminderSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '${process.env.REACT_APP_API_URL}/api/admin/reminder-settings',
        reminderSettings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reminder settings updated!');
    } catch (err) {
      console.error('Failed to save reminder settings');
    }
  };

  return (
    <PageLayout>
      <div className={styles['centered-container']}>
        <h2 className={styles['header-title']}>🛠️ Admin Dashboard</h2>

        <button
  onClick={() => navigate('/admin/stats')}
  className={styles['stats-button']}
>
  📈 View Full Statistics Dashboard
</button>

         {/* GAD-7 / PHQ-9 Panels */}
        <div className={styles['panel-container']}>
          <div
            className={`${styles['panel-box']} ${activePanel === 'gad7' ? styles.active : ''}`}
            onClick={() => setActivePanel(activePanel === 'gad7' ? null : 'gad7')}
          >
            📘 GAD-7 Questions
          </div>
          <div
            className={`${styles['panel-box']} ${activePanel === 'phq9' ? styles.active : ''}`}
            onClick={() => setActivePanel(activePanel === 'phq9' ? null : 'phq9')}
          >
            📗 PHQ-9 Questions
          </div>
        </div>

        {activePanel === 'gad7' && (
          <div className={styles['question-wrapper']}>
            {gadQuestions.length > 0 ? renderQuestionList(gadQuestions) : <p>No GAD-7 questions found.</p>}
          </div>
        )}
        {activePanel === 'phq9' && (
          <div className={styles['question-wrapper']}>
            {phqQuestions.length > 0 ? renderQuestionList(phqQuestions) : <p>No PHQ-9 questions found.</p>}
          </div>
        )}

        {/* History Card */}
        <h3 className={styles['section-title']}>📊 Employee Assessment History</h3>
        <div className={styles['history-card']} onClick={() => navigate('/admin/employee-history')}>
          <span className={styles['card-title']}>View Full Employee Assessment Records →</span>
        </div>

        {/* Reminder Form */}
        <h3 className={styles['section-title']}>⏰ Reminder Settings</h3>
        <form className={styles['reminder-form']} onSubmit={handleReminderSubmit}>
          <label>Mood Popup 1 Time:
            <input type="time" value={reminderSettings.mood_popup_1}
              onChange={(e) => setReminderSettings({ ...reminderSettings, mood_popup_1: e.target.value })} />
          </label>
          <label>Mood Popup 2 Time:
            <input type="time" value={reminderSettings.mood_popup_2}
              onChange={(e) => setReminderSettings({ ...reminderSettings, mood_popup_2: e.target.value })} />
          </label>
          <label>Water Reminder Interval (min):
            <input type="number" value={reminderSettings.water_interval_minutes}
              onChange={(e) => setReminderSettings({ ...reminderSettings, water_interval_minutes: e.target.value })} />
          </label>
          <label>Posture Reminder Interval (min):
            <input type="number" value={reminderSettings.posture_interval_minutes}
              onChange={(e) => setReminderSettings({ ...reminderSettings, posture_interval_minutes: e.target.value })} />
          </label>
          <button type="submit" className={styles['save-button']} disabled={
            !reminderSettings.mood_popup_1 || !reminderSettings.mood_popup_2
          }>Save Settings</button>
        </form>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
