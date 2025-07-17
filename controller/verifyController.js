import pool from '../db.js';

export const handleOTPVerification = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).send('No OTP entered.');
  }

  const sessionData = req.session.tempLogin;
  if (!sessionData) {
    return res.status(400).send('Session expired. Please log in again.');
  }

  if (Date.now() > sessionData.expiry) {
    return res.status(400).send('OTP expired. Please log in again.');
  }

  const trimmedUserOTP = otp.trim();
  const actualOTP = sessionData.otp.toString().trim();

  if (trimmedUserOTP !== actualOTP) {
    return res.status(401).send('Invalid OTP. Please try again.');
  }

  // OTP matches
  req.session.user = {
    id: sessionData.id,
    name: sessionData.name,
    ichat: sessionData.ichat
  };

  delete req.session.tempLogin;
  return res.redirect('/dashboard');
};
