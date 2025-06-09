import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/jwt.js';
import { getDoctorsDefault, deleteDoctor, getMyDoctorProfile, updateMyDoctorProfile, getDoctorSlots } from '../controllers/doctors.js';

const router = express.Router();

router.get('/', getDoctorsDefault);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteDoctor);
router.get('/me', authenticateToken, getMyDoctorProfile);
router.put('/me', authenticateToken, updateMyDoctorProfile);
router.get('/:id/slots', getDoctorSlots); 

export default router;