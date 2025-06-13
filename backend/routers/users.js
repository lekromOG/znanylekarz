import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middlewares/jwt.js';
import { getUsers, getMyUserProfile, saveUserPicture, updateMyUserProfile, deleteUser, listUserFavourites } from '../controllers/users.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, getUsers);
router.get('/me', authenticateToken, getMyUserProfile);
router.put('/me', authenticateToken, updateMyUserProfile);
router.patch('/me/avatar', authenticateToken, saveUserPicture);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);
router.get('/me/favourites', authenticateToken, listUserFavourites);
router.post('/me/favourites', authenticateToken)

export default router;