// routes/classRoutes.js
import express from 'express';
import { getAllBadges } from '../controller/badgesController.js';

const router = express.Router();

router.get('/', getAllBadges);

export default router;
