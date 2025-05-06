// routes/questionsRoutes.js
import express from 'express';
import { getAllQuestions } from '../controller/questionsController.js';

const router = express.Router();

router.get('/', getAllQuestions);

export default router;
