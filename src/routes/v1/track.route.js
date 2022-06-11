const express = require('express');
const { trackController } = require('../../controllers');
const router = express.Router();

router.post('/config', trackController.configureTracker);
router.post('/start', trackController.startTracker);


module.exports = router;