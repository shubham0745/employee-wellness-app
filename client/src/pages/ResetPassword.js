import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      // 🔁 Updated API endpoint to deployed backend
      const res = await axios.post(`${process.env.REACT_APP_API_URL}https://employee-wellness-app.onrender.com/api/auth/reset-password/${token}`, {
        newPassword: password
      });
      setMessage(res.data.msg);
      setTimeout(() => navigate('/'), 2000); // Redirect to login page
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error resetting password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#003366' }}>
        Reset Password
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.6rem',
            backgroundColor: '#003366',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Password
        </button>
        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
