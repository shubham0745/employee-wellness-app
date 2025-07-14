import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const stateCityMap = {
  Jharkhand: ['Jamshedpur', 'Jamadoba', 'West Bokaro', 'Noamundi', 'Chandil', 'Jagannathpur', 'Chaibasa'],
  Odisha: ['Bhubaneswar', 'Gopalpur', 'Meramandali', 'Kalinganagar', 'Bamnipal', 'Sukinda', 'Balasore', 'Athagarh'],
  Maharashtra: ['Khopoli'],
  'Uttar Pradesh': ['Sahibabad'],
  Punjab: ['Ludhiana'],
};

const themes = [
  'Agriculture',
  'Civil Society Engagement',
  'Communications',
  'Community development',
  'Digital & Analytics',
  'Disability',
  'Education',
  'Finance & Accounts',
  'Gender & CE',
  'Grassroot Governance and Decentralised Planning',
  'Infrastructure',
  'People',
  'Planning & Ananlytics',
  'Public Health',
  'Skill Development',
  'Sports',
  'Supply Chain',
  'Tribal Identity',
  'Urban dev',
  'Urban Habitat',
  'Workplace Ecosystem'
];

const designations = [
  'Account Assistant',
  'Accountant',
  'Accounts Officer',
  'Administrative Assistant',
  'Administrative Officer',
  'Adolescent Health Facilitator',
  'Auxiliary Nurse Midwifery',
  'Block Coordinator',
  'Block ICDS Coordinator',
  'Block Learning Coordinator',
  'Block Officer',
  'Branding Co-Ordinator',
  'Care Giver',
  'Care Taker',
  'Centre Associate',
  'Centre Coordinator',
  'Civil Engineer',
  'Cluster Coordinator- Jaga Mission',
  'Coach',
  'Community Facilitator',
  'Community Health Assistant',
  'Compliance Officer',
  'Dairy Development Coordinator',
  'Data Analyst',
  'Data Coordinator',
  'Dispatch Officer',
  'District Co-Ordinator',
  'District Data And Documentation Coordinator',
  'Doctor',
  'Driver',
  'Field Coordinator',
  'Field Team Coordinator',
  'Gardener',
  'General Nursing&Midwifery',
  'Graphic Designer',
  'Health Assistant',
  'Helper',
  'IT Officer',
  'Instructor',
  'It Trainer - Kaushalyan',
  'Junior Engineer',
  'Lab Technician',
  'Learning Facilitator',
  'Librarian',
  'MIS & Documentation Officer',
  'MOBILISATION OFFICER',
  'Mansi Mitra',
  'Master Trainer',
  'Medical Assistant',
  'Mis & Documentation Officer',
  'Monitoring Evaluation Officer',
  'Multi Purpose Health Facilitator',
  'Nutrition Facilitator',
  'OFFICE ASSISTANT',
  'Office Assistant',
  'Office Associate',
  'People Associate',
  'Pharmacist',
  'Physiotherapist',
  'Program Documentation Officer',
  'Program Officer',
  'Project Assistant',
  'Project Associate',
  'Project Associate_Samvaad Ecosystem',
  'Project Co Ordinator',
  'Project Coordinator',
  'Project Coordinator- Jaga Mission',
  'Rig Assistant',
  'Senior Accounts Officer',
  'Senior Instructor',
  'Shoe Technician',
  'Special Educator',
  'Sports Assistant',
  'Sports Coordinator',
  'Sr. Centre Associate',
  'Stitching Master',
  'Sub-Centre Associate',
  'Supervisor-Rig',
  'Supply Chain Officer',
  'Surveyor',
  'Teacher',
  'Training Officer',
  'Village Resource Person',
  'Workplace Eco System Officer'
];

const heightOptions = [
  { label: '150 cm (4\'11")', value: '150' },
  { label: '155 cm (5\'1")', value: '155' },
  { label: '160 cm (5\'3")', value: '160' },
  { label: '165 cm (5\'5")', value: '165' },
  { label: '170 cm (5\'7")', value: '170' },
  { label: '175 cm (5\'9")', value: '175' },
  { label: '180 cm (5\'11")', value: '180' },
  { label: '185 cm (6\'1")', value: '185' },
  { label: '190 cm (6\'3")', value: '190' }
];

const weightOptions = Array.from({ length: 17 }, (_, i) => {
  const w = 40 + i * 5;
  return { label: `${w} kg`, value: `${w}` };
});

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    theme: '',
    designation: '',
    state: '',
    city: '',
    date_of_birth: '',
    age: '',
    phone: '',
    ailments: '',
    height: '',
    weight: '',
    blood_group: '',
    role: 'employee',
  });

  const [message, setMessage] = useState('');

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === 'date_of_birth') {
      const age = calculateAge(value);
      updatedForm.age = age;
    }

    // Clear city if state is changed
    if (name === 'state') {
      updatedForm.city = '';
    }

    setForm(updatedForm);
  };

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      setMessage(
        '❌ Password must include uppercase, lowercase, number, special character (!@#$%^&*), and 8+ characters'
      );
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}https://employee-wellness-app.onrender.com/api/auth/register`, form);
      const { token, user } = res.data;

      if (!token || !user) {
        setMessage('❌ Invalid response from server');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      setMessage('✅ Registration successful!');
      setTimeout(() => {
      setMessage('➡️ Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000); // actual navigation after 1s
      }, 1000); // show success for 1s

    } catch (err) {
      console.error('❌ Registration Error:', err);
      setMessage(err.response?.data?.msg || '❌ Registration failed');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>📝 Employee Registration</h2>
      <form onSubmit={handleSubmit}>

        {/* Basic Inputs */}
        {['name', 'email', 'password', 'phone', 'ailments',].map((field) => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label>{field.replace('_', ' ').toUpperCase()}:</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required={['name', 'email', 'password'].includes(field)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        ))}

        {/* Blood Group (dropdown) */}
          <div style={{ marginBottom: '1rem' }}>
          <label>BLOOD GROUP:</label>
         <select
            name="blood_group"
           value={form.blood_group}
             onChange={handleChange}
             required
            style={{ width: '100%', padding: '0.5rem' }}
  >
              <option value="">-- Select Blood Group --</option>
             {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
           <option key={bg} value={bg}>{bg}</option>
         ))}
         </select>
        </div>


        {/* Date of Birth */}
        <div style={{ marginBottom: '1rem' }}>
          <label>DATE OF BIRTH:</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>

        {/* Theme */}
        <div style={{ marginBottom: '1rem' }}>
          <label>THEME:</label>
          <select name="theme" value={form.theme} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
            <option value="">-- Select Theme --</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>

        {/* Designation */}
        <div style={{ marginBottom: '1rem' }}>
          <label>DESIGNATION:</label>
          <select name="designation" value={form.designation} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
            <option value="">-- Select Designation --</option>
            {designations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* State */}
        <div style={{ marginBottom: '1rem' }}>
          <label>STATE:</label>
          <select name="state" value={form.state} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
            <option value="">-- Select State --</option>
            {Object.keys(stateCityMap).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* City (dependent) */}
        {form.state && (
          <div style={{ marginBottom: '1rem' }}>
            <label>CITY:</label>
            <select name="city" value={form.city} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
              <option value="">-- Select City --</option>
              {stateCityMap[form.state].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}

        {/* Height */}
        <div style={{ marginBottom: '1rem' }}>
          <label>HEIGHT:</label>
          <select name="height" value={form.height} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
            <option value="">-- Select Height --</option>
            {heightOptions.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div style={{ marginBottom: '1rem' }}>
          <label>WEIGHT:</label>
          <select name="weight" value={form.weight} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem' }}>
            <option value="">-- Select Weight --</option>
            {weightOptions.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>

        <button type="submit">Register</button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
};

export default Register;
