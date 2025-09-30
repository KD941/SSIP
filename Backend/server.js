import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import smartBinRoutes from './routes/SmartBin.js';
import incidentRoutes from './routes/incidents.js';

import User from './models/User.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/smartbins', smartBinRoutes);
app.use('/api/incidents', incidentRoutes);

const MONGO_URI = "mongodb://localhost:27017/WMS_IoT"; // Hardcoded MongoDB connection string
const PORT = 8000; // Server port

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

  } catch (error) {
    console.error(`${error} did not connect`);
  }
};

startServer();