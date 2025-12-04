import { embedText } from '../services/embedText.js';
import { pool } from '../services/db.js';
import pdf from 'pdf-parse';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const chunkText = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
};

const uploadController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const data = await pdf(req.file.buffer);
        const text = data.text;
        const filename = req.file.originalname;

        // Insert document into the documents table
        const docResult = await pool.query(
            'INSERT INTO documents (filename, text) VALUES ($1, $2) RETURNING id',
            [filename, text]
        );
        const docId = docResult.rows[0].id;

        // Chunk the text and insert into the chunks table
        const chunks = chunkText(text, 1000); // chunk size of 1000 characters
        for (const chunk of chunks) {
            const embedding = await embedText(chunk);
            await pool.query(
                'INSERT INTO chunks (doc_id, content, embedding) VALUES ($1, $2, $3)',
                [docId, chunk, embedding]
            );
        }

        res.status(200).send({ message: 'File uploaded and processed successfully.', docId });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file.');
    }
};

export { upload, uploadController };
