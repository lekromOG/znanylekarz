import express from 'express';
const router = express.Router();
import { deleteUser } from '../controllers/users.js';
import { getUsers } from '../controllers/users.js';

router.get('', getUsers);
router.delete('/:id', deleteUser);

export default router;