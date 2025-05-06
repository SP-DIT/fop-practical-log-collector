// controller/pointsController.js
import pool from '../db.js';

export const getAllPoints = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM points');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

