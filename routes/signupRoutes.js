import express from 'express';
import { handleSignup } from '../controller/signupController.js';

const router = express.Router();

// POST /signup
router.post('/signup', handleSignup);

export default router;
