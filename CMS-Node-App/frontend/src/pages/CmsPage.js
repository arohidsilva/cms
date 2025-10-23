import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CmsPage() {
  const [nodes, setNodes] = useState([]);
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchNodes();
    fetchLogs();
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/nodes');
      setNodes(response.data.nodes);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/uploads/logs');
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/api/uploads', formData);
      fetchLogs();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const toggleNodeConnection = async (node) => {
    try {
      if (node.connected) {
        // Disconnect the node
        await axios.post(`http://localhost:3000/api/nodes/disconnect/${node.nodeId}`);
      } else {
        // Register the node
        await axios.post(`http://localhost:3000/api/nodes/register`, {
          nodeId: node.nodeId,
          ip: node.ip,
          port: node.port
        });
      }
      fetchNodes();
    } catch (error) {
      console.error('Error toggling node connection:', error);
    }
  };

  return (
    <div>
      <h2>CMS Dashboard</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Upload File</h5>
          <div className="mb-3">
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>
          <button className="btn btn-primary" onClick={handleUpload}>Upload to All Nodes</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Connected Nodes</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>IP</th>
                  <th>Port</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => (
                  <tr key={node.nodeId}>
                    <td>{node.nodeId}</td>
                    <td>{node.ip}</td>
                    <td>{node.port}</td>
                    <td>{node.connected ? 'Connected' : 'Disconnected'}</td>
                    <td>
                      <button 
                        className={`btn btn-sm ${node.connected ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleNodeConnection(node)}
                      >
                        {node.connected ? 'Disconnect' : 'Register'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Upload Logs</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Filename</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.nodeId}</td>
                    <td>{log.filename}</td>
                    <td>{log.status}</td>
                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CmsPage;