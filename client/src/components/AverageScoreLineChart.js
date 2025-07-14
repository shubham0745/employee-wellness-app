import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const AverageScoreLineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
  axios.get('https://employee-wellness-app.onrender.com/api/admin/stats/average-scores', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(res => {
      console.log('Avg Score Response:', res.data);

      const labels = res.data.map(row => {
  try {
    const date = new Date(row.date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return 'Unknown';
  }
});

      const gadScores = res.data.map(row => parseFloat(row.avg_gad7_score));
      const phqScores = res.data.map(row => parseFloat(row.avg_phq9_score));

      setChartData({
        labels,
        datasets: [
          {
            label: 'GAD-7 Average Score',
            data: gadScores,
            borderColor: '#3e95cd',
            backgroundColor: 'rgba(62, 149, 205, 0.2)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'PHQ-9 Average Score',
            data: phqScores,
            borderColor: '#8e5ea2',
            backgroundColor: 'rgba(142, 94, 162, 0.2)',
            fill: true,
            tension: 0.4,
          }
        ]
      });
    })
    .catch(err => {
      console.error('Error fetching average scores:', err);
    });
}, []);

  if (!chartData) return <p style={{ textAlign: 'center' }}>Loading average score trends...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto' }}>
      <h3 style={{ textAlign: 'center', color: '#003366' }}>📈 Average Score Trends</h3>
      <Line data={chartData} />
    </div>
  );
};

export default AverageScoreLineChart;
