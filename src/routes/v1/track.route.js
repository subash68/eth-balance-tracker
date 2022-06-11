const express = require('express');

const router = express.Router();

router.post('/config', (req, res) => {
        res.json({value: "from config post"});
    });

router.post('/start', (req, res) => {
        res.json({value: "from start method"});
    });

module.exports = router;