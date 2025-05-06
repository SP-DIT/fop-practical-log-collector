import express from 'express';
import usersRoutes from './usersRoutes.js';
import pointsRoutes from './pointsRoutes.js';

const router = express.Router();

// Mount sub-routes
router.use('/users', usersRoutes);
router.use('/points', pointsRoutes);

export default router;
