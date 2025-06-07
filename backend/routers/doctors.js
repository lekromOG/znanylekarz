import express from 'express';
const router = express.Router();
import { getDoctors } from '../controllers/doctors.js';

router.get('/doctors', getDoctors);
// router.get('/doctors/:city/:specialty/:sort', getDoctorsByParameters);

export default router;