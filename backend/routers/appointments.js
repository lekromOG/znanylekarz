import express from 'express';
const router = express.Router();
import { createAppointment } from '../controllers/appointments.js';
import { authenticateToken } from '../middlewares/jwt.js';

router.post('/', authenticateToken, createAppointment);

export default router;