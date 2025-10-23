import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CmsPage from './pages/CmsPage';
import NodePage from './pages/NodePage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Node Management System</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">CMS</Link>
              <Link className="nav-link" to="/node">Node App</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<CmsPage />} />
          <Route path="/node" element={<NodePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;