import express from 'express';
import { authenticateToken } from '../middlewares/jwt.js';
import { getMyUserProfile, updateMyUserProfile } from '../controllers/users.js';

const router = express.Router();

router.get('/me', authenticateToken, getMyUserProfile);
router.put('/me', authenticateToken, updateMyUserProfile);

export default router;