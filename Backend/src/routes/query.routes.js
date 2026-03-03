// src/routes/query.routes.js
import { Router } from 'express';
import { queryCodebase, queryFile } from '../controllers/query.controller.js';

const router = Router();

// POST /api/query
router.post('/', queryCodebase);

// POST /api/query/file
router.post('/file', queryFile);

export default router;