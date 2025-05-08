import express from 'express';
const router = express.Router();
import { login, register, verify } from '../controllers/auth.js';
import { authenticateToken } from '../middlewares/jwt.js';

router.post('/login', login);
router.post('/register', register);
router.get('/login', authenticateToken, verify);

export default router;