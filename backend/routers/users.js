import express from 'express';
import { authenticateToken } from '../middlewares/jwt.js';
import { getMyUserProfile, saveUserPicture, updateMyUserProfile } from '../controllers/users.js';

const router = express.Router();

router.get('/me', authenticateToken, getMyUserProfile);
router.put('/me', authenticateToken, updateMyUserProfile);
router.patch('/me/avatar', authenticateToken, saveUserPicture);

export default router;