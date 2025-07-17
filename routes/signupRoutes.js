import express from 'express';
import { handleSignup } from '../controller/signupController.js';
import { redirectIfAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/signup', redirectIfAuthenticated, (req, res) => {
  res.sendFile('signup.html', { root: './public' });
});

// POST /signup
router.post('/signup', handleSignup);

export default router;
