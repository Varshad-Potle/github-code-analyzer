// src/routes/repo.routes.js
const { Router } = require('express');
const { ingestRepo } = require('../controllers/repo.controller.js'); // [cite: 57]

const router = Router();

// POST /api/repo/ingest [cite: 49]
router.post('/ingest', ingestRepo);

module.exports = router;