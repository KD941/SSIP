import express from 'express';
import { getIncidents, createIncident, updateIncidentStatus } from '../controllers/incidentController.js';

const router = express.Router();

router.get('/', getIncidents);
router.post('/', createIncident);
router.patch('/:id', updateIncidentStatus);

export default router;