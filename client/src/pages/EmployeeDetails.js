import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './EmployeeHistory.module.css';

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}https://employee-wellness-app.onrender.com/api/admin/employee-details/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDetails(res.data);
      } catch (err) {
        console.error('Failed to fetch details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [employeeId, token]);

  const getUniqueDates = () => {
    if (!details) return [];
    const dates = [
      ...details.assessments.map(a => new Date(a.date).toLocaleDateString()),
      ...details.moods.map(m => new Date(m.date).toLocaleDateString()),
    ];
    return [...new Set(dates)];
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!details) return <div className={styles.container}>No data available.</div>;

 return (
  <div className={styles.container}>
    <h2 className={styles.pageTitle}>
      📰 <span className={styles.nameHighlight}>{details.name}</span>'s History
    </h2>

    <div className={styles.filterRow}>
      <label>
        <span role="img" aria-label="calendar">📅</span> <strong>Filter by Date:</strong>&nbsp;
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          <option value="">All Dates</option>
          {getUniqueDates().map((date, idx) => (
            <option key={idx} value={date}>{date}</option>
          ))}
        </select>
      </label>
    </div>

    <>
      <h3 className={styles.subHeading}>📋 Assessments</h3>
      {details.assessments.length > 0 ? (
        <div className={styles.cardGrid}>
          {details.assessments
            .filter(a => !selectedDate || new Date(a.date).toLocaleDateString() === selectedDate)
            .map((a, index) => (
              <div key={index} className={styles.detailCard}>
                <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>
                <p><strong>Type:</strong> {a.type}</p>
                <p><strong>Score:</strong> {a.score}</p>
                <p><strong>Severity:</strong> {a.severity}</p>
              </div>
            ))}
        </div>
      ) : (
        <p>No assessment records found.</p>
      )}

      <h3 className={styles.subHeading}>🙂 Mood Entries</h3>
      {details.moods.length > 0 ? (
        <div className={styles.cardGrid}>
          {details.moods
            .filter(m => !selectedDate || new Date(m.date).toLocaleDateString() === selectedDate)
            .map((m, index) => (
              <div key={index} className={styles.detailCard}>
                <p><strong>Date:</strong> {new Date(m.date).toLocaleDateString()}</p>
                <p><strong>Mood:</strong> {m.mood}</p>
              </div>
            ))}
        </div>
      ) : (
        <p>No mood entries available.</p>
      )}
    </>
  </div>
);
}

export default EmployeeDetails;
