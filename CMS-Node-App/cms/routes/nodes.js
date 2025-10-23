const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');

// Node registration and management routes
router.post('/register', nodeController.registerNode);
router.post('/disconnect/:nodeId', nodeController.disconnectNode);
router.get('/', nodeController.getAllNodes);
router.get('/:nodeId', nodeController.getNodeById);

module.exports = router;