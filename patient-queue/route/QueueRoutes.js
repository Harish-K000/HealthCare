const express = require('express');
const router = express.Router();
const queueOptimization = require('../controller/queueOptimization');

router.get('/queue', queueOptimization);

module.exports = router;
