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
    const query = `
        SELECT attempt_logs.*
        FROM attempt_logs
        LEFT JOIN est_done ON attempt_logs.student_id = est_done.student_id
        WHERE est_done.student_id IS NULL
        ORDER BY attempt_logs.id DESC
        LIMIT 50
    `;
    return pool.query(query).then((result) => result.rows);
}

export function getStudentRecord(studentId) {
    const query = 'SELECT * FROM attempt_logs WHERE student_id = $1 ORDER BY id DESC';
    return pool.query(query, [studentId]).then((result) => result.rows);
}

export function getDoneRecords(page = 1) {
    const offset = (page - 1) * 50;
    const query = `SELECT * FROM est_done ORDER BY student_id DESC LIMIT 50 OFFSET $1`;
    return pool.query(query, [offset]).then((result) => result.rows);
}

export function markAsUndone(studentId) {
    const query = 'DELETE FROM est_done WHERE student_id = $1';
    return pool.query(query, [studentId]).then((result) => {
        return result.rowCount > 0;
    });
}

export function markAsDone(studentId) {
    const query = 'INSERT INTO est_done (student_id) values ($1)';
    return pool.query(query, [studentId]).then((result) => {
        return result.rowCount > 0;
    });
}
