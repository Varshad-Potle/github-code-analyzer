// src/routes/index.js [cite: 45]
const { Router } = require('express');
const repoRoutes = require('./repo.routes.js');
const queryRoutes = require('./query.routes.js');
const vizRoutes = require('./viz.routes.js');

const router = Router();

router.use('/repo', repoRoutes);
router.use('/query', queryRoutes);
router.use('/viz', vizRoutes);

module.exports = router;