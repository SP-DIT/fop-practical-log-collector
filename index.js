import express from 'express';
import validate from './schema.js';
import logger from './logger.js';
import createHttpError from 'http-errors';
import cors from 'cors';
import { nanoid } from 'nanoid';

import attemptRouter from './results.route.js';
import { addResult } from './results.model.js';

// const app = express();
// app.use(cors());

// // Middleware to parse JSON requests
// app.use(express.json());

function logResult(student_id, class_name, results) {
    const sessionId = nanoid();
    const resultsWithStudentIdAndClassName = results.map((result) => ({
        ...result,
        student_id,
        class_name,
    }));
    // Send the results to database
    addResult(resultsWithStudentIdAndClassName);

    results.forEach(({ problem_set, question, testcase, result }) => {
        logger.log({
            level: 'info',
            type: 'result',
            session_id: sessionId,
            student_id,
            className: class_name,
            problem_set,
            question,
            testcase,
            result,
        });
    });
}

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// // Endpoint to receive programming assignment results
// app.post('/results', async (req, res, next) => {
//     // Validate the payload
//     const valid = validate(req.body);
//     if (!valid) {
//         return next(createHttpError(400, validate.errorsText()));
//     }

    const { student_id, class: className, results } = req.body;

    console.log(`Detected Student Id: `, student_id, `Classname:`, className);

    // Log results to Loki
    // logResult(student_id, className, results);

    res.sendStatus(200);
});

app.use('/results', attemptRouter);

// app.use((error, req, res, next) => {
//     console.log(error);
//     logger.error(error.message || 'Internal Server Error');
//     res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
// });

// export default app;
