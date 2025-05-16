import { Router } from 'express';
import {
    getAttemptsByClassNameAndProblemSet,
    getAttemptsByProblemSet,
    getAttemptsByQuestion,
    getAttemptsByStudentId,
} from './attempt.model';

const router = Router();

// Endpoint to get attempts by student ID
router.get('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const attempts = await getAttemptsByStudentId(studentId);
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint to get attempts by class name
router.get('/classes/:className', async (req, res) => {
    const { className } = req.params;
    try {
        const attempts = await getAttemptsByClassNameAndProblemSet(className);
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint to get attempts by problem set
router.get('/problem-sets/:problemSet', async (req, res) => {
    const { problemSet } = req.params;
    try {
        const attempts = await getAttemptsByProblemSet(problemSet);
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint to get attempts by problem set and question
router.get('/problem-sets/:problemSet/questions/:question', async (req, res) => {
    const { problemSet, question } = req.params;
    try {
        const attempts = await getAttemptsByQuestion(problemSet, question);
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
