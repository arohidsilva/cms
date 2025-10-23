const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// File upload routes
router.post('/', uploadController.upload.single('file'), uploadController.uploadFile);
router.get('/logs', uploadController.getUploadLogs);

module.exports = router;