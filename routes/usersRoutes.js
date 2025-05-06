// routes/usersRoutes.js
import express from 'express';
import { getAllUsers } from '../controller/usersController.js';

const router = express.Router();

router.get('/', getAllUsers);

export default router;
