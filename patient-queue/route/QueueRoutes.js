const express = require('express');
const router = express.Router();
const queueOptimization = require('../controllers/queueOptimization');

router.get('/queue', queueOptimization);

module.exports = router;
