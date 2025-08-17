import Ajv from 'ajv';

const ajv = new Ajv();

// Define the JSON schema for the payload
const payloadSchema = {
    type: 'object',
    properties: {
        student_id: { type: 'string' },
        class: { type: 'string' },
        results: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    problem_set: { type: 'string' },
                    question: { type: 'number' },
                    testcase: { type: 'number' },
                    result: { type: 'number', enum: [0, 1] },
                },
                required: ['problem_set', 'question', 'testcase', 'result'],
            },
        },
    },
    required: ['student_id', 'class', 'results'],
};

const validate = ajv.compile(payloadSchema);

validate.errorsText = () => {
    return ajv.errorsText(validate.errors);
};

export default validate;
