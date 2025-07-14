import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/Dashboard.css';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const moodLabels = {
  1: '😡 Angry',
  2: '😔 Sad',
  3: '😐 Neutral',
  4: '🙂 Calm',
  5: '😄 Happy',
};

const MyStats = () => {
  const [gadData, setGadData] = useState([]);
  const [phqData, setPhqData] = useState([]);
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');

      const gad = await axios.get(`${process.env.REACT_APP_API_URL}/api/assessment/history?type=GAD-7`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const phq = await axios.get(`${process.env.REACT_APP_API_URL}/api/assessment/history?type=PHQ-9`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mood = await axios.get(`${process.env.REACT_APP_API_URL}/api/mood`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGadData(gad.data);
      setPhqData(phq.data);
      setMoodData(mood.data);
    };

    fetchHistory();
  }, []);

  const formatChartData = (data) => ({
    labels: data.map(d => new Date(d.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Score',
        data: data.map(d => d.total_score),
        fill: false,
        borderColor: '#1a4f8b',
        tension: 0.3,
      },
    ],
  });

  const formatMoodChartData = (data) => {
    const emojiToValue = {
      '😄': 5, // happy
      '🙂': 4, // calm
      '😐': 3, // neutral
      '😔': 2, // sad
      '😡': 1, // angry
    };

    const sorted = [...data].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return {
      labels: sorted.map(entry =>
        new Date(entry.created_at).toLocaleString(undefined, {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      ),
      datasets: [
        {
          label: 'Mood Level',
          data: sorted.map(entry => emojiToValue[entry.mood] || 0),
          fill: false,
          borderColor: '#1a4f8b',
          tension: 0.3,
        },
      ],
    };
  };

  const moodYAxis = {
    ticks: {
      callback: function (value) {
        return moodLabels[value] || '';
      },
      stepSize: 1,
      min: 1,
      max: 5,
    },
  };

  const downloadReport = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/assessment/report`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Mental_Health_Report.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="stats-section">
      <h2 className="test-title">GAD-7 Score Trend</h2>
      {gadData.length > 0 ? (
        <Line data={formatChartData(gadData)} />
      ) : (
        <p>No GAD-7 data available.</p>
      )}

      <h2 className="test-title" style={{ marginTop: '2rem' }}>PHQ-9 Score Trend</h2>
      {phqData.length > 0 ? (
        <Line data={formatChartData(phqData)} />
      ) : (
        <p>No PHQ-9 data available.</p>
      )}

      <h2 className="test-title" style={{ marginTop: '2rem' }}>Mood Trend</h2>
      {moodData.length > 0 ? (
        <Line
          data={formatMoodChartData(moodData)}
          options={{
            scales: {
              y: moodYAxis,
            },
          }}
        />
      ) : (
        <p>No mood data available.</p>
      )}

      <button className="download-btn" onClick={downloadReport}>
        Download Report
      </button>
    </div>
  );
};

export default MyStats;
