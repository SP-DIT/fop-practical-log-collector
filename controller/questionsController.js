// controller/questionsController.js
import pool from '../db.js';

export const getAllQuestions = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT question_number FROM questions');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

