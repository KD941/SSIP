import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function StaffDashboard({ user }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await axios.get(`${API_URL}/api/incidents`);
      // For simplicity, we'll show all 'Assigned' incidents as tasks
      
      setTasks(data.filter(inc => inc.status === 'Assigned' || inc.status === 'InProgress'));
    };
    fetchTasks();
  }, []);

  const handleUpdateTask = async (id, newStatus) => {
    try {
        await axios.patch(`${API_URL}/api/incidents/${id}`, { status: newStatus });
        // Refresh tasks
        const { data } = await axios.get(`${API_URL}/api/incidents`);
        setTasks(data.filter(inc => inc.status === 'Assigned' || inc.status === 'InProgress'));
    } catch (error) {
        console.error("Failed to update task", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Cleaning Staff Dashboard</h2>
        <span>Welcome, {user.username} | Tokens: {user.profile.tokens}</span>
      </div>

      <div className="card">
        <h3>My Assigned Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task._id}><strong>{task.description}</strong> <button onClick={() => handleUpdateTask(task._id, 'Resolved')}>Mark as Resolved</button></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StaffDashboard;