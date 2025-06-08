import express from 'express';
import { authenticateToken } from '../middlewares/jwt.js';
import { getDoctors, deleteDoctor, getMyDoctorProfile, updateMyDoctorProfile, getDoctorSlots } from '../controllers/doctors.js';

const router = express.Router();

router.get('/', getDoctors);
router.delete('/:id', deleteDoctor);
router.get('/me', authenticateToken, getMyDoctorProfile);
router.put('/me', authenticateToken, updateMyDoctorProfile);
router.get('/:id/slots', getDoctorSlots); 

export default router;