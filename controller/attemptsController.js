import pool from '../db.js';

export const getAllAttempts = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM Attempts');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

export const getAverageAttemptsByTopic = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        RANK() OVER (PARTITION BY q.topic ORDER BY SUM(a.attempts)::float / COUNT(DISTINCT a.question_id)) AS rank,
        u.name,
        c.class,
        q.topic,
        ROUND(SUM(a.attempts)::float / COUNT(DISTINCT a.question_id), 2) AS average_attempts
      FROM
        Attempts a
      JOIN "User" u ON a.user_id = u.id
      JOIN Class c ON u.class_id = c.id
      JOIN Question q ON a.question_id = q.id
      GROUP BY
        u.name, c.class, q.topic
      ORDER BY
        q.topic, average_attempts;
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching average attempts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
