export async function addAttempt(results) {
    const query = `
        INSERT INTO attempts (student_id, class_name, problem_set, question, testcase, result)
        VALUES ${results
            .map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`)
            .join(', ')}
        ON CONFLICT (student_id, class_name, problem_set, question, testcase)
        DO UPDATE SET result = GREATEST(attempts.result, EXCLUDED.result)
    `;
    const values = results.flatMap((r) => [
        r.student_id,
        r.class_name,
        r.problem_set,
        r.question,
        r.testcase,
        r.result,
    ]);
    const result = await db.query(query, values);
    return result.rowCount;
}

export async function getAttemptsByStudentId(studentId) {
    const query = `
        SELECT * FROM attempts WHERE student_id = $1
    `;
    const values = [studentId];
    const result = await db.query(query, values);
    return result.rows;
}
export async function getAttemptsByClassNameAndProblemSet(className, problemSet) {
    const query = `
        SELECT * FROM attempts WHERE class_name = $1 AND problem_set = $2
    `;
    const values = [className, problemSet];
    const result = await db.query(query, values);
    return result.rows;
}
export async function getAttemptsByProblemSet(problemSet) {
    const query = `
        SELECT * FROM attempts WHERE problem_set = $1
    `;
    const values = [problemSet];
    const result = await db.query(query, values);
    return result.rows;
}
export async function getAttemptsByQuestion(problemSet, question) {
    const query = `
        SELECT * FROM attempts WHERE problem_set = $1 AND question = $2
    `;
    const values = [problemSet, question];
    const result = await db.query(query, values);
    return result.rows;
}
