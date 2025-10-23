const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Node = require('../models/node');
const UploadLog = require('../models/uploadLog');
const FormData = require('form-data');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) 
    }
});

async function uploadToNode(nodeId, file, io) {
    try {
        const node = await Node.findOne({ where: { nodeId } });
        if (!node || !node.connected) {
            throw new Error('Node not connected');
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path));

        const response = await axios.post(
            `http://${node.ip}:${node.port}/upload`,
            formData,
            {
                headers: formData.getHeaders(),
                maxBodyLength: Infinity
            }
        );

        await UploadLog.create({
            nodeId,
            filename: file.filename,
            status: 'success',
            message: 'File uploaded successfully'
        });

        if (io) {
            io.emit('upload-status', {
                nodeId,
                filename: file.filename,
                status: 'success'
            });
        }

        return true;
    } catch (error) {
        console.error(`Error uploading to node ${nodeId}:`, error);
        
        await UploadLog.create({
            nodeId,
            filename: file.filename,
            status: 'failed',
            message: error.message
        });

        if (io) {
            io.emit('upload-status', {
                nodeId,
                filename: file.filename,
                status: 'failed'
            });
        }

        return false;
    }
}

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const nodes = await Node.findAll({ where: { connected: true } });
        if (nodes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No connected nodes available'
            });
        }

        const uploadResults = await Promise.all(
            nodes.map(node => uploadToNode(node.nodeId, req.file, req.app.get('io')))
        );

        const successCount = uploadResults.filter(result => result).length;

        res.json({
            success: true,
            message: `File uploaded to ${successCount}/${nodes.length} nodes`,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Error in file upload:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing file upload'
        });
    }
};

exports.getUploadLogs = async (req, res) => {
    try {
        const logs = await UploadLog.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100
        });

        res.json({
            success: true,
            logs
        });
    } catch (error) {
        console.error('Error fetching upload logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upload logs'
        });
    }
};

exports.upload = upload;