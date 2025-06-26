import express from 'express';
import usersRoutes from './usersRoutes.js';
import pointsRoutes from './pointsRoutes.js';
import classRoutes from './classRoutes.js';
import questionsRoutes from './questionsRoutes.js';
import badgesRoutes from './badgesRoutes.js';
import attmeptsRoutes from './attemptsRoutes.js';
import fastestRoutes from './fastestRoutes.js'
import attemptsRoutes from './attemptsRoutes.js';
import signupRoutes from './signupRoutes.js';
import loginRoutes from './loginRoutes.js';

const router = express.Router();

// Mount sub-routes
router.use('/users', usersRoutes);
router.use('/points', pointsRoutes);
router.use('/class', classRoutes);
router.use('/questions', questionsRoutes);
router.use('/badges', badgesRoutes);
router.use('/attempts', attemptsRoutes);
router.use('/fastest', fastestRoutes);
router.use('/', signupRoutes);
router.use('/', loginRoutes);

export default router;
