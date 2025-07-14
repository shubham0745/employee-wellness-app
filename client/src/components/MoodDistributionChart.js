import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MoodDistributionChart = () =>  {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats/mood-distribution`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const labels = res.data.map(entry => entry.label);
        const counts = res.data.map(entry => entry.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Mood Count',
              data: counts,
              backgroundColor: ['#66ccff', '#99ff99', '#ffcc99', '#ff6666', '#ccccff'],
              borderRadius: 6,
            },
          ],
        });
      } catch (err) {
        console.error('Mood chart fetch error:', err.message);
      }
    };

    fetchMoodData();
  }, []);

  if (!chartData) return <p style={{ textAlign: 'center' }}>Loading chart...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h3 style={{ textAlign: 'center', color: '#003366' }}>🧠 Mood Distribution Overview</h3>
      <Bar data={chartData} />
    </div>
  );
};


export default MoodDistributionChart;
