import { pool } from '../services/db.js';

const deleteDocById = async (req, res) => {
    try {
        const { docId } = req.params;

        if (!docId) {
            return res.status(400).send('Document ID is required.');
        }

        // First, delete the chunks associated with the document
        await pool.query('DELETE FROM chunks WHERE doc_id = $1', [docId]);

        // Then, delete the document itself
        const docResult = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING id', [docId]);

        if (docResult.rowCount === 0) {
            return res.status(404).send({ message: 'Document not found.' });
        }

        res.status(200).send({ message: 'Document and associated chunks deleted successfully.' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).send('Error deleting document.');
    }
};

export { deleteDocById };
