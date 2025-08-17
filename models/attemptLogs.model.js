import pool from '../utils/database.js';

export function addRecord(studentId, className) {
    // Implementation for adding a record to the database
    const query = 'INSERT INTO attempt_logs (student_id, class) VALUES ($1, $2)';
    return pool.query(query, [studentId, className]).then((result) => {
        return result.rowCount > 0;
    });
}

export function checkRecord(recordId) {
    const query = 'UPDATE attempt_logs SET checked=NOW() WHERE id = $1 RETURNING *';
    return pool.query(query, [recordId]).then((result) => {
        return result.rows[0];
    });
}

export function getRecords() {
    const query = 'SELECT * FROM attempt_logs ORDER BY id DESC LIMIT 50';
    return pool.query(query).then((result) => result.rows);
}
