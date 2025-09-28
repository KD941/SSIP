import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function AdminDashboard({ user }) {
  const [incidents, setIncidents] = useState([]);
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const incidentsRes = await axios.get(`${API_URL}/api/incidents`);
      setIncidents(incidentsRes.data);
      const binsRes = await axios.get(`${API_URL}/api/smart-bins`);
      setBins(binsRes.data);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/incidents/${id}`, { status: newStatus });
      // Refresh incidents
      const incidentsRes = await axios.get(`${API_URL}/api/incidents`);
      setIncidents(incidentsRes.data);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <span>Welcome, {user.username}</span>
      </div>

      <div className="card">
        <h3>Manage Citizen Reports</h3>
        <ul>
          {incidents.map((incident) => (
            <li key={incident._id}>
              <div>
                <strong>{incident.description}</strong> (Reporter: {incident.reporterId?.username || 'N/A'})
                <br />
                Status: {incident.status}
              </div>
              <select 
                value={incident.status} 
                onChange={(e) => handleStatusChange(incident._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="InProgress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Smart Bin Status</h3>
        <ul>
          {bins.map((bin) => (
            <li key={bin._id}>
              <strong>Bin ID: {bin.binId}</strong>
              <span>Fill Level: {bin.fillLevel}%</span>
              <span>Status: {bin.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;