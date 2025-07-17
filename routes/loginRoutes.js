// routes/loginRoutes.js
import express from 'express';
import { handleLogin } from '../controller/loginController.js';
import { redirectIfAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.sendFile('login.html', { root: './public' });
});
// POST /login
router.post('/login', handleLogin);

export default router;
