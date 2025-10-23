const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) 
    }
});

// Handle file upload
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Emit status via socket if connected
        if (req.app.get('socket')) {
            req.app.get('socket').emit('upload-status', {
                nodeId: process.env.NODE_ID,
                filename: req.file.originalname,
                status: 'success'
            });
        }

        res.json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                filename: req.file.originalname,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Error handling file upload:', error);

        if (req.app.get('socket')) {
            req.app.get('socket').emit('upload-status', {
                nodeId: process.env.NODE_ID,
                filename: req.file?.originalname,
                status: 'failed'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error processing file upload'
        });
    }
});

module.exports = router;