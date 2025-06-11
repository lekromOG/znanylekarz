import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/jwt.js';
import { getDoctorsDefault, deleteDoctor, getMyDoctorProfile, updateMyDoctorProfile, getDoctorSlots, getDoctorProfile, opinionDoctor } from '../controllers/doctors.js';

const router = express.Router();

router.get('/', getDoctorsDefault);
router.get('/profile/:id', getDoctorProfile)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteDoctor);
router.get('/me', authenticateToken, getMyDoctorProfile);
router.put('/me', authenticateToken, updateMyDoctorProfile);
router.get('/:id/slots', getDoctorSlots);
router.post('/profile/:id/opinions', authenticateToken, opinionDoctor); 

export default router;