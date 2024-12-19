const express = require('express');
const { createReductionPlan, recordProgress } = require('../controllers/reductionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/reduction-plan', authMiddleware, createReductionPlan);
router.post('/progress', authMiddleware, recordProgress);

module.exports = router;