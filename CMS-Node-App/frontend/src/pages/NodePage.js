import React, { useState } from 'react';
import axios from 'axios';

function NodePage() {
  const [selectedNode, setSelectedNode] = useState('4001');
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const nodes = [
    { id: '4001', name: 'Node 1' },
    { id: '4002', name: 'Node 2' }
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:${selectedNode}/upload`, formData);
      setUploadResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadResult({ success: false, message: 'Upload failed' });
    }
  };

  return (
    <div>
      <h2>Node App Dashboard</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Direct Node Upload</h5>
          
          <div className="mb-3">
            <label className="form-label">Select Node:</label>
            <select 
              className="form-select" 
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
            >
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.name} (Port: {node.id})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">File:</label>
            <input 
              type="file" 
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleUpload}
          >
            Upload to Node
          </button>

          {uploadResult && (
            <div className={`alert mt-3 ${uploadResult.success ? 'alert-success' : 'alert-danger'}`}>
              {uploadResult.message}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Node Information</h5>
          <p>Current Node: {nodes.find(n => n.id === selectedNode)?.name}</p>
          <p>Upload Directory: /uploads/localhost/{selectedNode}/node-{selectedNode === '4001' ? '1' : '2'}/</p>
        </div>
      </div>
    </div>
  );
}

export default NodePage;