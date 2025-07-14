import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './EmployeeHistory.module.css';
import { useNavigate } from 'react-router-dom';

const EmployeeHistory = () => {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ state: '', city: '' });
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchEmployees = async () => {
    try {
      const query = new URLSearchParams();
      if (filters.state) query.append('state', filters.state);
      if (filters.city) query.append('city', filters.city);

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/employees?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);

      const states = [...new Set(res.data.map(e => e.state).filter(Boolean))];
      const cities = [...new Set(res.data.map(e => e.city).filter(Boolean))];
      setAvailableStates(states);
      setAvailableCities(cities);
    } catch (err) {
      console.error('Error fetching employee list:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleClick = (employeeId) => {
    navigate(`/admin/employee-history/${employeeId}`);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.container}>
      <h2>👥 All Employees</h2>

      <div className={styles.filters}>
        <select name="state" value={filters.state} onChange={handleFilterChange}>
          <option value="">Filter by State</option>
          {availableStates.map((state, idx) => (
            <option key={idx} value={state}>{state}</option>
          ))}
        </select>

        <select name="city" value={filters.city} onChange={handleFilterChange}>
          <option value="">Filter by City</option>
          {availableCities.map((city, idx) => (
            <option key={idx} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {employees.map((emp) => (
          <div key={emp.id} className={styles.card} onClick={() => handleClick(emp.id)}>
            <h3>{emp.name}</h3>
            <p><strong>Email:</strong> {emp.email}</p>
            <p><strong>DOB:</strong> {new Date(emp.date_of_birth).toLocaleDateString()}</p>
            <p><strong>Age:</strong> {emp.age}</p>
            <p><strong>Theme:</strong> {emp.theme}</p>
            <p><strong>Designation:</strong> {emp.designation}</p>
            <p><strong>State:</strong> {emp.state}</p>
            <p><strong>City:</strong> {emp.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeHistory;
