import pool from '../db.js';

export const handleSignup = async (req, res) => {
    const { name, ichat, className } = req.body;

    if (!name || !ichat || !className) {
        return res.status(400).send('Please fill all fields.');
    }

    const client = await pool.connect();
    try {
        // 1. Check if class exists
        const classResult = await client.query('SELECT id FROM class WHERE class = $1', [className]);

        let classId;
        if (classResult.rows.length > 0) {
            classId = classResult.rows[0].id;
        } else {
            // 2. Insert class if it doesn't exist
            const insertClass = await client.query(
                'INSERT INTO class(class) VALUES($1) RETURNING id',
                [className]
            );
            classId = insertClass.rows[0].id;
        }


        // 3. Insert user with class_id
        await client.query(
            'INSERT INTO users (name, ichat, class_id) VALUES ($1, $2, $3)',
            [name, ichat, classId]
        );

        // 4. Redirect
        res.redirect('/FastestSolve.html');

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        client.release();
    }
};