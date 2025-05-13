// controller/fastestController.js
import pool from '../db.js';

export const getAllTime = async (req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT rank, name, class, EXTRACT(EPOCH FROM "time taken") AS time_seconds
        FROM fastest_solve
      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      client.release();
    }
  };
  