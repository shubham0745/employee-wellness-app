import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminStats.css';

const AdminStats = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-stats-container">
      <h2>Admin Dashboard Stats</h2>
      <div className="admin-stats-cards">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees}</p>
        </div>
        <div className="stat-card">
          <h3>GAD-7 Submissions</h3>
          <p>{stats.gadSubmissions}</p>
        </div>
        <div className="stat-card">
          <h3>PHQ-9 Submissions</h3>
          <p>{stats.phqSubmissions}</p>
        </div>
        <div className="stat-card">
          <h3>Mood Entries</h3>
          <p>{stats.moodEntries}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
