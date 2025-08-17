import { Router } from 'express';
import {
    checkRecord,
    getRecords,
    markAsDone,
    markAsUndone,
    getDoneRecords,
    getStudentRecord,
} from '../models/attemptLogs.model.js';

const router = Router();

router.get('/', (req, res) => {
    // Get all records
    getRecords().then((records) => {
        return res.json(records);
    });
});

router.get('/students/:studentId', (req, res) => {
    const { studentId } = req.params;
    getStudentRecord(studentId).then((record) => {
        if (record) {
            return res.json(record);
        }
        return res.status(404).json({ message: 'Record not found' });
    });
});

router.put('/:recordId/check', (req, res) => {
    const { recordId } = req.params;
    checkRecord(recordId).then((record) => {
        if (record) {
            return res.status(200).json(record);
        }
        return res.status(404).json({ message: 'Record not found' });
    });
});

router.post('/students/:studentId/done', (req, res) => {
    const { studentId } = req.params;
    markAsDone(studentId).then((record) => {
        if (record) {
            return res.status(200).json(record);
        }
        return res.status(404).json({ message: 'Record not found' });
    });
});

router.delete('/students/:studentId/undone', (req, res) => {
    const { studentId } = req.params;
    markAsUndone(studentId).then((success) => {
        if (success) {
            return res.status(200).json({ message: 'Record marked as undone' });
        }
        return res.status(404).json({ message: 'Record not found' });
    });
});

router.get('/students/done', (req, res) => {
    getDoneRecords().then((records) => {
        return res.json(records);
    });
});

export default router;
