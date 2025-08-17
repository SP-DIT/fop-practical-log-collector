import express from 'express';
import validate from './utils/schema.js';
import logger from './utils/logger.js';
import createHttpError from 'http-errors';
import cors from 'cors';
import { nanoid } from 'nanoid';

import resultRouter from './routers/results.route.js';
import { addResult } from './models/results.model.js';
import attemptsRouter from './routers/attemptLogs.route.js';
import { addRecord } from './models/attemptLogs.model.js';

const app = express();
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

app.use(express.static('public'));

function logResult(student_id, class_name, results) {
    const sessionId = nanoid();
    const resultsWithStudentIdAndClassName = results.map((result) => ({
        ...result,
        student_id,
        class_name,
    }));

    // Send the results to database
    addResult(resultsWithStudentIdAndClassName);
    addRecord(student_id, class_name);

    // Send results to loki
    // results.forEach(({ problem_set, question, testcase, result }) => {
    //     logger.log({
    //         level: 'info',
    //         type: 'result',
    //         session_id: sessionId,
    //         student_id,
    //         className: class_name,
    //         problem_set,
    //         question,
    //         testcase,
    //         result,
    //     });
    // });
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint to receive programming assignment results
app.post('/results', async (req, res, next) => {
    // Validate the payload
    const valid = validate(req.body);
    if (!valid) {
        return next(createHttpError(400, validate.errorsText()));
    }

    const { student_id, class: className, results } = req.body;

    logResult(student_id, className, results);

    res.sendStatus(200);
});

app.use('/results', resultRouter);
app.use('/attempts', attemptsRouter);

app.use((error, req, res, next) => {
    console.log(error);
    logger.error(error.message || 'Internal Server Error');
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
});

export default app;
