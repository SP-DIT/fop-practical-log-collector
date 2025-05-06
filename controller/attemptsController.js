// controller/attemptsController.js
import pool from '../db.js';

export const getAllAttempts = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM attempts');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

