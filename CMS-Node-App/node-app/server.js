const express = require('express');
const cors = require('cors');
const { io } = require('socket.io-client');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/upload', require('./routes/upload'));

// Socket.IO connection to CMS
const socket = io(process.env.CMS_URL);

// Store socket instance in app
app.set('socket', socket);

// Socket event handlers
socket.on('connect', () => {
    console.log('Connected to CMS via WebSocket');
});

socket.on('disconnect', () => {
    console.log('Disconnected from CMS');
});

socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});

// Function to register with CMS
async function registerWithCMS() {
    try {
        const response = await axios.post(`${process.env.CMS_URL}/api/nodes/register`, {
            nodeId: process.env.NODE_ID,
            ip: 'localhost', // In production, this should be the actual IP
            port: process.env.PORT
        });

        if (response.data.success) {
            console.log('Successfully registered with CMS:', response.data.message);
        }
    } catch (error) {
        console.error('Failed to register with CMS:', error.message);
        // Retry after 5 seconds
        setTimeout(registerWithCMS, 5000);
    }
}

// Start server
const PORT = process.env.PORT || 4001;
app.listen(PORT, async () => {
    console.log(`Node App running on port ${PORT}`);
    console.log(`Node ID: ${process.env.NODE_ID}`);
    
    // Register with CMS
    await registerWithCMS();
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    // Disconnect from CMS if needed
    socket.disconnect();
    process.exit(0);
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Attempt to notify CMS of error if possible
    if (socket.connected) {
        socket.emit('node-error', {
            nodeId: process.env.NODE_ID,
            error: error.message
        });
    }
});