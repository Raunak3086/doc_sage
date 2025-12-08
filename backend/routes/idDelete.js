import express from 'express';
import { deleteDocById } from '../controllers/idDeleteController.js';

const router = express.Router();

router.delete('/:docId', deleteDocById);

export default router;
