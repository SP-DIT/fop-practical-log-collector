import pool from '../db.js';
import { sendOTPEmail } from '../services/mailService.js'; // <-- use the nodemailer function

export const handleLogin = async (req, res) => {
  const { name, ichat } = req.body;

  if (!name || !ichat) {
    return res.status(400).send('Please fill all fields.');
  }

  // const client = await pool.connect();

  try {
    // Check if user exists with given ichat and name
    const result = await pool.query(
      'SELECT * FROM users WHERE ichat = $1 AND name = $2',
      [ichat, name]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials. Please try again.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    req.session.tempLogin = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      ichat: result.rows[0].ichat,
      otp,
      expiry
    };

    // Send OTP (assuming sendOTPEmail is set up)
    await sendOTPEmail(ichat, otp);

    // Redirect to OTP page
    return res.redirect('/verify-otp');

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send('Internal Server Error');
  } finally {
    client.release();
  }
};

