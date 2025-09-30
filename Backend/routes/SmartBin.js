import express from 'express';
import { getBins, createBin } from '../controllers/smartBinController.js';

const router = express.Router();

router.get('/', getBins);
router.post('/', createBin);

export default router;

