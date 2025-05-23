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

export const addUserWithPoints = async (req, res) => {
  const { name, class_id, question_id } = req.body;
  const client = await pool.connect();
  try {
    const userResult = await client.query(
      'INSERT INTO users (name, class_id) VALUES ($1, $2) RETURNING id',
      [name, class_id]
    );
    const userId = userResult.rows[0].id;

    await client.query(
      'INSERT INTO points (user_id, question_id) VALUES ($1, $2)',
      [userId, question_id]
    );

    res.status(201).json({ message: 'User and points added successfully.' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
