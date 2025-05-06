// controller/badgesController.js
import pool from '../db.js';

export const getAllBadges = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM badges');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

