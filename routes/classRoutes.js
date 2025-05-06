// routes/classRoutes.js
import express from 'express';
import { getAllClass } from '../controller/classController.js';

const router = express.Router();

router.get('/', getAllClass);

export default router;
