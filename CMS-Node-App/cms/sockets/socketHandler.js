const Node = require('../models/node');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle node status updates
    socket.on('upload-status', async (data) => {
      try {
        const { nodeId, status, filename } = data;
        
        // Update node status in database
        await Node.update(
          { lastUploadStatus: status },
          { where: { nodeId } }
        );

        // Broadcast status to all connected clients
        io.emit('status-update', { nodeId, status, filename });
      } catch (error) {
        console.error('Error handling upload status:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};