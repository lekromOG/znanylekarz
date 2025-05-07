import express from 'express';
const router = express.Router();
import { getDoctors } from '../controllers/doctors.js';

router.get('/doctors', getDoctors);

export default router;