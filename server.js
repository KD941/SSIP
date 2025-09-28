import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import smartBinRoutes from './routes/smartBins.js';
import incidentRoutes from './routes/incidents.js';

import User from './models/User.js'; // Import User model to create seed data

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/smart-bins', smartBinRoutes);
app.use('/api/incidents', incidentRoutes);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    
    // Basic Seed Data on first run
    User.countDocuments().then(async (count) => {
        if (count === 0) {
            console.log("No users found, creating seed users...");
            await User.create({ username: 'admin', password: 'password', role: 'Admin', profile: { points: 0 } });
            await User.create({ username: 'citizen', password: 'password', role: 'Citizen', profile: { points: 0 } });
            await User.create({ username: 'staff', password: 'password', role: 'CleaningStaff', profile: { tokens: 0 } });
            console.log("Seed users created.");
        }
    });
  })
  .catch((error) => console.log(`${error} did not connect`));