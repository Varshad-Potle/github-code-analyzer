// src/routes/query.routes.js
const { Router } = require('express');
const { queryCodebase, queryFile } = require('../controllers/query.controller.js'); // [cite: 59]

const router = Router();

// POST /api/query [cite: 51]
router.post('/', queryCodebase);

// POST /api/query/file [cite: 51-52]
router.post('/file', queryFile);

module.exports = router;