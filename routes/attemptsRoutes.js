import express from 'express';
import {
  getAllAttempts,
  getAverageAttemptsByTopic
} from '../controller/attemptsController.js';

const router = express.Router();

router.get('/', getAllAttempts);
router.get('/average-attempts', getAverageAttemptsByTopic);

export default router;
