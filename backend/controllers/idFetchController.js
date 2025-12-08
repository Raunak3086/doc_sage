import { pool } from '../services/db.js';

const getDocIdsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).send('User ID is required.');
        }

        const docResult = await pool.query('SELECT id FROM documents WHERE user_id = $1', [userId]);

        if (docResult.rows.length === 0) {
            return res.status(404).send({ message: 'No documents found for this user.' });
        }

        const docIds = docResult.rows.map(row => row.id);

        res.status(200).send({ docIds });
    } catch (error) {
        console.error('Error getting document IDs:', error);
        res.status(500).send('Error getting document IDs.');
    }
};

export { getDocIdsByUserId };
