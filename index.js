import express from 'express';
import validate from './schema.js';
import logger from './logger.js';
import createHttpError from 'http-errors';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

function logResult(student_id, class_name, problem_set, question, testcase, result) {
    logger.info({ message: { student_id, className: class_name, problem_set, question, testcase, result } });
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint to receive programming assignment results
app.post('/results', async (req, res, next) => {
    // Validate the payload
    const valid = validate(req.body);
    console.log(valid, validate.errors);
    if (!valid) {
        return next(createHttpError(400, validate.errorsText()));
    }

    const { student_id, class: className, results } = req.body;

    // Log results to Loki
    results.forEach(({ problem_set, question, testcase, result }) => {
        logResult(student_id, className, problem_set, question, testcase, result);
    });

    res.sendStatus(200);
});

app.use((error, req, res, next) => {
    console.log(error);
    logger.error(error.message || 'Internal Server Error');
    res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
});

export default app;
