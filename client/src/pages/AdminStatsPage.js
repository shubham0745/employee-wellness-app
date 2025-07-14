// src/pages/AdminStatsPage.js

import React from 'react';
import AdminStats from '../components/AdminStats';
import AverageScoreLineChart from '../components/AverageScoreLineChart';
import DailySubmissionsChart from '../components/DailySubmissionsChart';
import SeverityPieChart from '../components/SeverityPieChart';
import MoodDistributionChart from '../components/MoodDistributionChart'; // if exists
import '../styles/AdminStatsPage.css'; // optional styling

const AdminStatsPage = () => {
  return (
    <div>
      <div className="admin-stats-container">
        <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>📊 Admin Statistics Dashboard</h2>

         <AdminStats />
        

        <div className="chart-section">
          <AverageScoreLineChart />
        </div>

        <div className="chart-section">
          <DailySubmissionsChart />
        </div>

        <div className="chart-section">
          <SeverityPieChart />
        </div>

        <div className="chart-section">
          <MoodDistributionChart />
        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;
