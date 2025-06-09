import express from 'express';
const router = express.Router();
import { createAppointment, getUserAppointments, cancelAppointment } from '../controllers/appointments.js';
import { authenticateToken } from '../middlewares/jwt.js';

router.post('/', authenticateToken, createAppointment);
router.get('/', authenticateToken, getUserAppointments); // <-- Add this line
router.delete('/:id', authenticateToken, cancelAppointment);

export default router;