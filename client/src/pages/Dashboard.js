import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import DashboardHome from '../components/DashboardHome';
import MyTests from '../components/MyTests';
import MyStats from '../components/MyStats';
import MyHealth from '../components/MyHealth';
import '../styles/Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('');
  const [morningMoodTime, setMorningMoodTime] = useState('');
  const [eveningMoodTime, setEveningMoodTime] = useState('');
  const [waterReminderTime, setWaterReminderTime] = useState('');
  const [postureReminderTime, setPostureReminderTime] = useState('');
  const [showMoodPopup, setShowMoodPopup] = useState(false);

  const lastPopupShownRef = useRef('');

  // Fetch user name and reminder times
  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem('token');
      console.log('📦 Token being used:', token);

      if (!token) {
        console.warn('⚠️ No token found in localStorage');
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}https://employee-wellness-app.onrender.com/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('✅ Username response:', res.data);
        setUserName(res.data.name);
      } catch (error) {
        console.error('❌ Failed to fetch user name:', error.message);
      }
    };

    const fetchReminderTimes = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.REACT_APP_API_URL}https://employee-wellness-app.onrender.com/api/admin/reminder-settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const times = res.data;

    setMorningMoodTime(times.mood_popup_1);
    setEveningMoodTime(times.mood_popup_2);

    const now = new Date();
    const addMinutes = (m) => {
      const newTime = new Date(now.getTime() + m * 60000);
      return newTime.toTimeString().slice(0, 5);
    };

    if (times.water_interval_minutes)
      setWaterReminderTime(addMinutes(times.water_interval_minutes));
    if (times.posture_interval_minutes)
      setPostureReminderTime(addMinutes(times.posture_interval_minutes));
  } catch (err) {
    console.error('Failed to fetch reminder times:', err);
  }
};

    fetchUserName();
    fetchReminderTimes();
  }, []);

  // Interval: Check time every minute and show reminders
  useEffect(() => {
    if (
      !morningMoodTime &&
      !eveningMoodTime &&
      !waterReminderTime &&
      !postureReminderTime
    ) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"

      const reminders = [
        { time: morningMoodTime, type: 'morning-mood', action: () => setShowMoodPopup(true) },
        { time: eveningMoodTime, type: 'evening-mood', action: () => setShowMoodPopup(true) },
        { time: waterReminderTime, type: 'water', action: () => alert('💧 Time to drink water!') },
        { time: postureReminderTime, type: 'posture', action: () => alert('🪑 Time to check your posture!') },
      ];

      reminders.forEach(({ time, type, action }) => {
        if (currentTime === time && lastPopupShownRef.current !== `${type}-${currentTime}`) {
          action();
          lastPopupShownRef.current = `${type}-${currentTime}`;
        }
      });
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [morningMoodTime, eveningMoodTime, waterReminderTime, postureReminderTime]);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome userName={userName} />;
      case 'mytests':
        return <MyTests />;
      case 'mystats':
        return <MyStats />;
      case 'myhealth':
        return <MyHealth />;
      default:
        return <DashboardHome userName={userName} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} userName={userName} />
      <div className="dashboard-content">{renderTab()}</div>

      {showMoodPopup && (
        <div className="mood-popup-overlay">
          <div className="mood-popup-content">
            <h3>How are you feeling right now?</h3>
            <div className="emoji-options">
              {['😄', '🙂', '😐', '😔', '😡'].map((emoji) => (
                <button
                  key={emoji}
                  className="emoji-button"
                 onClick={async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${process.env.REACT_APP_API_URL}https://employee-wellness-app.onrender.com/api/mood`,
      { mood: emoji }, // directly send emoji or map to value if needed
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Mood saved from popup:', emoji);
  } catch (error) {
    console.error('❌ Failed to save mood from popup:', error.message);
  } finally {
    setShowMoodPopup(false);
  }
}}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
