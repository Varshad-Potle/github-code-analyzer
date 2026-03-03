// src/routes/viz.routes.js
const { Router } = require('express');
const { getFolderTree, getTechStack } = require('../controllers/viz.controller.js'); // [cite: 61]

const router = Router();

// GET /api/viz/tree [cite: 54]
router.get('/tree', getFolderTree);

// GET /api/viz/techstack [cite: 54-55]
router.get('/techstack', getTechStack);

module.exports = router;