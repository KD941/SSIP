import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function CitizenDashboard({ user }) {
  const [incidents, setIncidents] = useState([]);
  const [description, setDescription] = useState('');

  const fetchIncidents = async () => {
    const { data } = await axios.get(`${API_URL}/api/incidents`);
    // Filter for incidents reported by the current user
    setIncidents(data.filter(inc => inc.reporterId?._id === user._id));
  };

  useEffect(() => {
    fetchIncidents();
  }, [user]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!description) return;

    const newIncident = {
      reporterId: user._id,
      description,
      // Using static location for simplicity
      location: { coordinates: [-73.935242, 40.730610] }, 
    };

    try {
      await axios.post(`${API_URL}/api/incidents`, newIncident);
      setDescription('');
      fetchIncidents(); // Refresh the list
      alert('Report submitted! You earned 10 points.');
    } catch (error) {
      console.error("Failed to submit report", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Citizen Dashboard</h2>
        <span>Welcome, {user.username} | Points: {user.profile.points}</span>
      </div>

      <div className="card">
        <h3>Report a New Incident</h3>
        <form onSubmit={handleSubmitReport}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue (e.g., 'Overflowing bin near park entrance')"
            rows="3"
            style={{ width: '95%', padding: '10px', marginBottom: '10px' }}
          ></textarea>
          <button type="submit">Submit Report</button>
        </form>
      </div>

      <div className="card">
        <h3>My Reported Incidents</h3>
        <ul>
          {incidents.map((incident) => (
            <li key={incident._id}><strong>{incident.description}</strong> <span>Status: {incident.status}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CitizenDashboard;