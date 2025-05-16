// controller/classController.js
import pool from '../db.js';

export const getAllClass = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM class');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

export const getAllClassRank = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT SUM (questions.points) AS total_score, class.class
      FROM users
      JOIN points ON points.user_id = users.id
      JOIN questions ON points.question_id = questions.id
      JOIN class ON class.id = users.class_id
      GROUP BY class.class
      ORDER BY total_score DESC
      `);
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};