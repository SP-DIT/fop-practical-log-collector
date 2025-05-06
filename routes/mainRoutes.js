import express from 'express';
import usersRoutes from './usersRoutes.js';
import pointsRoutes from './pointsRoutes.js';
import classRoutes from './classRoutes.js';
import questionsRoutes from './questionsRoutes.js';
import badgesRoutes from './badgesRoutes.js';
import attmeptsRoutes from './attemptsRoutes.js';

const router = express.Router();

// Mount sub-routes
router.use('/users', usersRoutes);
router.use('/points', pointsRoutes);
router.use('/class', classRoutes);
router.use('/questions', questionsRoutes);
router.use('/badges', badgesRoutes);
router.use('/attempts', attmeptsRoutes);

export default router;
