import express from 'express';
import authRoutes from './auth.js';
import smartBinRoutes from './SmartBin.js';
import incidentRoutes from './incidents.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/smartbins', smartBinRoutes);
router.use('/incidents', incidentRoutes);

export default router;
