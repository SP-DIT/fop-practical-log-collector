// routes/classRoutes.js
import express from 'express';
import { getAllClass, getAllClassRank } from '../controller/classController.js';
import { addUserWithPoints } from '../controller/classController.js';
const router = express.Router();

router.get('/', getAllClass);
router.get('/rank', getAllClassRank);
router.post('/add-user', addUserWithPoints);


export default router;



