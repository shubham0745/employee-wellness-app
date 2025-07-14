import React, { useState } from 'react';
import axios from 'axios';
import PageLayout from '../components/PageLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('${process.env.REACT_APP_API_URL}/api/auth/forgot-password', { email });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <PageLayout>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
        <form
          onSubmit={handleForgot}
          style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <h2 style={{ textAlign: 'center', color: '#003366' }}>🔑 Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.6rem',
              marginBottom: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
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
              cursor: 'pointer',
            }}
          >
            Send Reset Link
          </button>
          {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: 'green' }}>{message}</p>}
        </form>
      </div>
    </PageLayout>
  );
};

export default ForgotPassword;
