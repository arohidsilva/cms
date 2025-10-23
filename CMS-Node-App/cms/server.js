const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to controllers via req.app.get('io')
app.set('io', io);

// Simple health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Socket.IO connection handling
require('./sockets/socketHandler')(io);

// Routes
app.use('/api/nodes', require('./routes/nodes'));
app.use('/api/uploads', require('./routes/uploads'));

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
    
    server.listen(PORT, () => {
      console.log(`CMS Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();