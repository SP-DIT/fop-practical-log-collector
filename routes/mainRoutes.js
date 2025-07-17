import express from 'express';
import usersRoutes from './usersRoutes.js';
import pointsRoutes from './pointsRoutes.js';
import classRoutes from './classRoutes.js';
import questionsRoutes from './questionsRoutes.js';
import badgesRoutes from './badgesRoutes.js';
import fastestRoutes from './fastestRoutes.js'
import attemptsRoutes from './attemptsRoutes.js';
import signupRoutes from './signupRoutes.js';
import loginRoutes from './loginRoutes.js';
import verifyRoutes from './verifyRoutes.js';
import { requireAuth } from '../middleware/auth.js';


const router = express.Router();

// Mount sub-routes
router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile('dashboard.html', { root: './views' });
});
router.use('/users', usersRoutes);
router.use('/points', pointsRoutes);
router.use('/class', classRoutes);
router.use('/questions', questionsRoutes);
router.use('/badges', badgesRoutes);
router.use('/attempts', attemptsRoutes);
router.use('/fastest', fastestRoutes);
router.use('/', signupRoutes);
router.use('/', loginRoutes);
router.use('/', verifyRoutes);


export default router;
