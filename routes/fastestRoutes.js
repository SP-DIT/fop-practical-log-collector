// routes/fastestRoutes.js
import express from 'express';
import { getAllTime } from '../controller/fastestController.js';

const router = express.Router();

router.get('/', getAllTime);

export default router;
