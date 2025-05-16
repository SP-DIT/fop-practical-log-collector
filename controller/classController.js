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
      SELECT users.id, users.class_id, points.question_id, questions.points
      FROM users
      JOIN points ON points.user_id = users.class_id
      JOIN questions ON points.question_id = questions.question_number
      
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