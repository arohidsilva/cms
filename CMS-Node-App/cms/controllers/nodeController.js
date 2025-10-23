const Node = require('../models/node');

// Register a new node
exports.registerNode = async (req, res) => {
    try {
        const { nodeId, ip, port } = req.body;

        if (!nodeId || !ip || !port) {
            return res.status(400).json({ 
                success: false, 
                message: 'NodeId, IP, and Port are required' 
            });
        }

        // Check if node already exists
        let node = await Node.findOne({ where: { nodeId } });
        
        if (node) {
            // Update existing node
            node = await node.update({
                ip,
                port,
                connected: true,
                lastSeen: new Date()
            });
            return res.json({ 
                success: true, 
                message: 'Node reconnected', 
                node 
            });
        }

        // Create new node
        node = await Node.create({
            nodeId,
            ip,
            port,
            connected: true
        });

        res.status(201).json({ 
            success: true, 
            message: 'Node registered successfully', 
            node 
        });
    } catch (error) {
        console.error('Error registering node:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error registering node' 
        });
    }
};

// Disconnect a node
exports.disconnectNode = async (req, res) => {
    try {
        const { nodeId } = req.params;
        
        const node = await Node.findOne({ where: { nodeId } });
        
        if (!node) {
            return res.status(404).json({ 
                success: false, 
                message: 'Node not found' 
            });
        }

        await node.update({ 
            connected: false,
            lastSeen: new Date()
        });

        res.json({ 
            success: true, 
            message: 'Node disconnected successfully' 
        });
    } catch (error) {
        console.error('Error disconnecting node:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error disconnecting node' 
        });
    }
};

// Get all nodes
exports.getAllNodes = async (req, res) => {
    try {
        const nodes = await Node.findAll();
        res.json({ 
            success: true, 
            nodes 
        });
    } catch (error) {
        console.error('Error fetching nodes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching nodes' 
        });
    }
};

// Get node by ID
exports.getNodeById = async (req, res) => {
    try {
        const { nodeId } = req.params;
        const node = await Node.findOne({ where: { nodeId } });
        
        if (!node) {
            return res.status(404).json({ 
                success: false, 
                message: 'Node not found' 
            });
        }

        res.json({ 
            success: true, 
            node 
        });
    } catch (error) {
        console.error('Error fetching node:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching node' 
        });
    }
};