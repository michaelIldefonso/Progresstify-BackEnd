
import express from 'express';
import { checkAdmin } from '../src/adminApp/middleware/checkAdmin';
import { getAllUsers } from '../src/adminApp/controllers/userController';

const router = express.Router();

router.get('/users', checkAdmin, getAllUsers);

export default router;