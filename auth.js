import express from 'express';
import { loginUser, getSeedUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/seed-users', getSeedUsers); // Helper to show available users

export default router;