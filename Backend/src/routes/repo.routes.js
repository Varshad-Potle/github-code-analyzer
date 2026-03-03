// src/routes/repo.routes.js
import { Router } from 'express';
import { ingestRepo } from '../controllers/repo.controller.js';

const router = Router();

// POST /api/repo/ingest
router.post('/ingest', ingestRepo);

export default router;