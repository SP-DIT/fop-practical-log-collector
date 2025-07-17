import express from 'express';
import { handleOTPVerification } from '../controller/verifyController.js';

const router = express.Router();

router.get('/verify-otp', (req, res) => {
  if (!req.session.tempLogin) {
    return res.redirect('/login');
  }

  res.sendFile('otpVerification.html', { root: './views' }); 
});


router.post('/verify-otp', handleOTPVerification);

export default router;
