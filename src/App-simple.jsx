import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SimpleWindow from './components/SimpleWindow';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  const [showWindow, setShowWindow] = useState(false);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'monospace',
      background: 'linear-gradient(45deg, #008080 0%, #004040 100%)'
    }}>
      {/* Simple Navigation */}
      <nav style={{ 
        padding: '10px', 
        backgroundColor: '#c0c0c0', 
        borderBottom: '2px solid #808080',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.2em' }}>WEYLAND CORP</h1>
        <Link to="/" style={{ padding: '4px 8px', textDecoration: 'none', backgroundColor: '#e0e0e0', border: '1px outset #c0c0c0' }}>
          Home
        </Link>
        <Link to="/about" style={{ padding: '4px 8px', textDecoration: 'none', backgroundColor: '#e0e0e0', border: '1px outset #c0c0c0' }}>
          About
        </Link>
        <Link to="/projects" style={{ padding: '4px 8px', textDecoration: 'none', backgroundColor: '#e0e0e0', border: '1px outset #c0c0c0' }}>
          Projects
        </Link>
        <button 
          onClick={() => setShowWindow(!showWindow)}
          style={{ padding: '4px 8px', backgroundColor: '#e0e0e0', border: '1px outset #c0c0c0', cursor: 'pointer' }}
        >
          {showWindow ? 'Close Window' : 'Open Window'}
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </main>

      {/* Test Window */}
      {showWindow && (
        <SimpleWindow 
          title="Test Window" 
          onClose={() => setShowWindow(false)}
        >
          <h3>Window Test</h3>
          <p>If you can see this, the basic functionality is working!</p>
          <button onClick={() => alert('Button clicked!')}>Test Button</button>
        </SimpleWindow>
      )}
    </div>
  );
}

export default App; 