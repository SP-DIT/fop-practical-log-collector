// controllers/attemptsController.js
import pool from '../db.js';

export const getLeastAttemptsByTopic = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      WITH first_correct AS (
        SELECT
          a.user_id,
          a.question_id,
          q.topic,
          MIN(a.attempt_number) AS attempts_to_correct
        FROM attempts a
        JOIN questions q ON a.question_id = q.id
        WHERE a.is_correct = TRUE
        GROUP BY a.user_id, a.question_id, q.topic
      )
      SELECT
        RANK() OVER (PARTITION BY topic ORDER BY SUM(fc.attempts_to_correct)) AS rank,
        u.name,
        c.class AS class,
        fc.topic,
        SUM(fc.attempts_to_correct) AS least_attempts
      FROM first_correct fc
      JOIN users u ON fc.user_id = u.id
      JOIN class c ON u.class_id = c.id
      GROUP BY u.name, c.class, fc.topic
      ORDER BY fc.topic, least_attempts;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching least attempts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
