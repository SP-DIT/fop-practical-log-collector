// routes/loginRoutes.js
import express from 'express';
import { handleLogin } from '../controller/loginController.js';

const router = express.Router();

// POST /login
router.post('/login', handleLogin);

export default router;
