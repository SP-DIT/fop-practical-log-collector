// routes/attemptsRoutes.js
import express from 'express';
import { getAllAttempts } from '../controller/attemptsController.js';

const router = express.Router();

router.get('/', getAllAttempts);

export default router;
