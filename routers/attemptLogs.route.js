import { Router } from 'express';
import { checkRecord, getRecords } from '../models/attemptLogs.model.js';

const router = Router();

router.get('/', (req, res) => {
    // Get all records
    getRecords().then((records) => {
        return res.json(records);
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

export default router;
