import pool from '../db.js';

export const handleLogin = async (req, res) => {
  const { name, ichat } = req.body;

  if (!name || !ichat) {
    return res.status(400).send('Please fill all fields.');
  }

  const client = await pool.connect();

  try {
    // Check if user exists with given ichat and name
    const result = await client.query(
      'SELECT * FROM users WHERE ichat = $1 AND name = $2',
      [ichat, name]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials. Please try again.');
    }

    // Successful login, redirect to dashboard or desired page
    res.redirect('/FastestSolve.html');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    client.release();
  }
};
