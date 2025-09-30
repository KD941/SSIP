import express from 'express';
import { 
    getIncidents, 
    createIncident, 
    updateIncidentStatus,
    getMyReportedIncidents,
    getMyAssignedTasks
} from '../controllers/incidentController.js';
import auth from '../middleware/auth.js'; // Assuming you have auth middleware

const router = express.Router();

// These routes should be protected
router.get('/', auth, getIncidents); // Admin
router.get('/my-reports', auth, getMyReportedIncidents); // Citizen
router.get('/my-tasks', auth, getMyAssignedTasks); // Staff
router.post('/', auth, createIncident);
router.patch('/:id', auth, updateIncidentStatus);

export default router;