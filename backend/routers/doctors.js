import express from 'express';
import { getDoctors, deleteDoctor } from '../controllers/doctors.js';

const router = express.Router();

router.get('/', getDoctors);
router.delete('/:id', deleteDoctor);

export default router;