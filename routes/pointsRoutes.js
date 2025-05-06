// routes/pointsRoutes.js
import express from 'express';
import { getAllPoints } from '../controller/pointsController.js';

const router = express.Router();

router.get('/', getAllPoints);

export default router;
