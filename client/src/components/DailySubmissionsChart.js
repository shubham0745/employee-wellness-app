import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const DailySubmissionsChart = () => {
  const [labels, setLabels] = useState([]);
  const [gad7Data, setGad7Data] = useState([]);
  const [phq9Data, setPhq9Data] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/admin/stats/daily-submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });

       const dates = res.data.map(item => item.date);
       const gad7Counts = res.data.map(item => item.gad7_count);
       const phq9Counts = res.data.map(item => item.phq9_count);


        setLabels(dates);
        setGad7Data(gad7Counts);
        setPhq9Data(phq9Counts);
      } catch (err) {
        console.error('Error fetching daily submissions:', err);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'GAD-7 Submissions',
        backgroundColor: '#66ccff',
        data: gad7Data,
      },
      {
        label: 'PHQ-9 Submissions',
        backgroundColor: '#99ffcc',
        data: phq9Data,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ textAlign: 'center', color: '#003366' }}>
        📊 Daily Assessment Submissions
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DailySubmissionsChart;
