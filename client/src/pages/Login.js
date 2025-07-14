import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('${process.env.REACT_APP_API_URL}/api/auth/login', {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        setError('Invalid response from server');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      console.log('✅ New token saved:', token);

      const me = await axios.get('${process.env.REACT_APP_API_URL}/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (me.data.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      console.error('❌ Login error:', err);
    }
  };

  return (
    <>
      <Navbar activeTab="login" setActiveTab={() => {}} userName="" />
      <PageLayout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <form
            onSubmit={handleLogin}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ textAlign: 'center', color: '#003366' }}>Login</h2>

            {error && (
              <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </p>
            )}

            {/* Email Field */}
<div
  style={{
    marginBottom: '1.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  }}
>
  <input
    type="email"
    placeholder="Email"
    onChange={(e) => setEmail(e.target.value)}
    required
    style={{
      width: '100%',
      padding: '0.6rem',
      border: 'none',
      outline: 'none',
      fontSize: '1rem',
      boxSizing: 'border-box',
    }}
  />
</div>

{/* Password Field */}
<div
  style={{
    marginBottom: '1.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
  }}
>
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    onChange={(e) => setPassword(e.target.value)}
    required
    style={{
      flex: 1,
      padding: '0.6rem',
      border: 'none',
      outline: 'none',
      fontSize: '1rem',
      boxSizing: 'border-box',
    }}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      padding: '0 0.75rem',
      height: '100%',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
    }}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      fill="#003366"
    >
      {showPassword ? (
        <path d="M12 6a9.77 9.77 0 0 1 9 6 9.77 9.77 0 0 1-9 6 9.77 9.77 0 0 1-9-6 9.77 9.77 0 0 1 9-6zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      ) : (
        <path d="M2.39 1.73 1.11 3l4.06 4.06A11.36 11.36 0 0 0 0 12c2.73 5 7.11 8 12 8a11.6 11.6 0 0 0 5.34-1.28l3.36 3.36 1.27-1.27M12 18c-4.16 0-7.89-2.5-10.11-6A13.21 13.21 0 0 1 5.5 8.61l1.61 1.61A3.9 3.9 0 0 0 9 14a3 3 0 0 0 3-3 3.9 3.9 0 0 0-0.22-1.11l5.1 5.1A9.68 9.68 0 0 1 12 18m0-14a11.6 11.6 0 0 1 10.11 6 13.21 13.21 0 0 1-2.26 3.39l-1.43-1.43A10.13 10.13 0 0 0 21.1 12C18.89 8.5 15.16 6 12 6c-1.19 0-2.34.22-3.39.6L7.28 5.28A13.17 13.17 0 0 1 12 4z" />
      )}
    </svg>
  </button>
</div>

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
              Login
            </button>

            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
              Don’t have an account?{' '}
              <Link to="/register" style={{ color: '#003366', fontWeight: 'bold' }}>
                Sign Up
              </Link>
            </p>

            <p style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              <Link to="/forgot-password" style={{ color: '#cc0000', textDecoration: 'underline' }}>
                Forgot Password?
              </Link>
            </p>
          </form>
        </div>
      </PageLayout>
    </>
  );
};

export default Login;
