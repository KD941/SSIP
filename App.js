import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import StaffDashboard from './components/StaffDashboard';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [seedUsers, setSeedUsers] = useState([]);

  useEffect(() => {
    // Fetch the seed users to display for login
    const fetchSeedUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/auth/seed-users`);
        setSeedUsers(data);
      } catch (error) {
        console.error("Could not fetch seed users", error);
      }
    };
    fetchSeedUsers();
  }, []);

  // Simple login simulation
  const handleLogin = async (username) => {
    try {
      // In a real app, you'd send username and password
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password: 'password', // Using a dummy password for simplicity
      });
      setUser(data);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed!');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Admin':
        return <AdminDashboard user={user} />;
      case 'Citizen':
        return <CitizenDashboard user={user} />;
      case 'CleaningStaff':
        return <StaffDashboard user={user} />;
      default:
        return <p>No dashboard available for this role.</p>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Waste Management</h1>
        {user && <button onClick={handleLogout} className="logout-button">Logout</button>}
      </header>
      <main>
        {!user ? (
          <div className="login-container">
            <h2>Select a user to login:</h2>
            {seedUsers.map(u => (
              <button key={u.username} onClick={() => handleLogin(u.username)}>Login as {u.username} ({u.role})</button>
            ))}
          </div>
        ) : renderDashboard()}
      </main>
    </div>
  );
}

export default App;