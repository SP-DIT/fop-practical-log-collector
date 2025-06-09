import express from 'express';
import {
  getLeastAttemptsByTopic
} from '../controller/attemptsController.js';

const router = express.Router();

router.get('/least-attempts', getLeastAttemptsByTopic);

export default router;
