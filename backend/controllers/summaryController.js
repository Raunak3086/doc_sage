import { pool } from '../services/db.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getSummary = async (req, res) => {
    try {
        const { id } = req.params;

        // Check for summary in the database
        let docResult = await pool.query('SELECT summary, text FROM documents WHERE id = $1', [id]);

        if (docResult.rows.length === 0) {
            return res.status(404).send('Document not found.');
        }

        let summary = docResult.rows[0].summary;
        const text = docResult.rows[0].text;

        // If summary exists, return it
        if (summary) {
            return res.status(200).send({ summary });
        }

        // If summary does not exist, generate it
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes text."
                },
                {
                    role: "user",
                    content: `Summarize the following text:\n\n${text}`
                }
            ],
        });

        summary = response.choices[0].message.content;

        // Save the summary to the database
        await pool.query('UPDATE documents SET summary = $1 WHERE id = $2', [summary, id]);

        res.status(200).send({ summary });
    } catch (error) {
        console.error('Error getting summary:', error);
        res.status(500).send('Error getting summary.');
    }
};

export { getSummary };
