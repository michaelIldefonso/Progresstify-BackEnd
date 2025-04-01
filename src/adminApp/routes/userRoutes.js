
import express from 'express';
import { checkAdmin } from '../middleware/checkAdmin';
import { getAllUsers } from '../controllers/userController';

const router = express.Router();

router.get('/users', checkAdmin, getAllUsers);

export default router;