import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [message, setMessage] = useState('');

 const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Or use `${month}-${day}-${year}`
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/update-profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <>
      <Navbar activeTab="profile" userName={profile.name} />
      <PageLayout>
        <div style={{ maxWidth: '650px', margin: 'auto', background: '#fff', padding: '2rem', borderRadius: '8px' }}>
          <h2 style={{ color: '#003366', marginBottom: '1rem' }}>My Profile</h2>

          {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}

          <form onSubmit={handleUpdate} className="profile-form">
            {/* Non-editable fields */}
            <div className="profile-row">
              <label>Name</label>
              <input type="text" value={profile.name || ''} disabled />
            </div>
            <div className="profile-row">
              <label>Email</label>
              <input type="email" value={profile.email || ''} disabled />
            </div>
            <div className="profile-row">
              <label>Role</label>
              <input type="text" value={profile.role || ''} disabled />
            </div>
            <div className="profile-row">
              <label>Date of Birth</label>
              <input type="text" value={formatDate(profile.date_of_birth)} disabled />
            </div>

            {/* Editable fields */}
            <div className="profile-row">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={profile.designation || ''}
                onChange={handleChange}
              />
            </div>
            <div className="profile-row">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
              />
            </div>
            <div className="profile-row">
              <label>Height</label>
              <input
                type="text"
                name="height"
                value={profile.height || ''}
                onChange={handleChange}
              />
            </div>
            <div className="profile-row">
              <label>Weight</label>
              <input
                type="text"
                name="weight"
                value={profile.weight || ''}
                onChange={handleChange}
              />
            </div>
            <div className="profile-row">
              <label>Any Ailments</label>
              <input
                type="text"
                name="ailments"
                value={profile.ailments || ''}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="update-profile-button"
              style={{
                marginTop: '1rem',
                backgroundColor: '#003366',
                color: 'white',
                padding: '0.6rem 1.2rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Update Profile
            </button>
          </form>
        </div>
      </PageLayout>
    </>
  );
};

export default Profile;
