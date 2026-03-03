// src/routes/viz.routes.js
import { Router } from 'express';
import { getFolderTree, getTechStack } from '../controllers/viz.controller.js';

const router = Router();

// GET /api/viz/tree
router.get('/tree', getFolderTree);

// GET /api/viz/techstack
router.get('/techstack', getTechStack);

export default router;