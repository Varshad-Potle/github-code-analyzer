// src/routes/index.js
import { Router } from 'express';
import repoRoutes from './repo.routes.js';
import queryRoutes from './query.routes.js';
import vizRoutes from './viz.routes.js';

const router = Router();

router.use('/repo', repoRoutes);
router.use('/query', queryRoutes);
router.use('/viz', vizRoutes);

export default router;