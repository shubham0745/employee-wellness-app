import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dashboard.css';

const Navbar = ({ activeTab, userName, handleLogout, setActiveTab }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/logo.png"
          alt="Tata Steel Foundation"
          style={{
            height: '60px',
            width: 'auto',
            backgroundColor: 'white',
            borderRadius: '6px',
            padding: '4px',
            marginRight: '0.8rem',
          }}
        />
        <h1 className="navbar-logo">Employee Wellness - TATA STEEL FOUNDATION</h1>
      </div>

      {activeTab !== 'login' && (
        <div className="navbar-center">
          <button
            className={activeTab === 'home' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={activeTab === 'mytests' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setActiveTab('mytests')}
          >
            My Tests
          </button>
          <button
            className={activeTab === 'mystats' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setActiveTab('mystats')}
          >
            My Stats
          </button>
          <button
            className={activeTab === 'myhealth' ? 'nav-tab active' : 'nav-tab'}
            onClick={() => setActiveTab('myhealth')}
          >
            My Health
          </button>
        </div>
      )}

      <div className="navbar-right">
        {activeTab !== 'login' && (
          <div className="profile-menu-container" ref={dropdownRef}>
            <span className="greeting">Hi, {userName?.split(' ')[0]}</span>
            <button
              className="dropdown-toggle"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              ☰
            </button>

            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={() => window.location.href = '/profile'}>My Profile</button>
                <button onClick={() => {
  localStorage.removeItem('token');
  window.location.href = '/';
}}>
  Sign Out
</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
