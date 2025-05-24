import React from 'react';

function SimpleWindow({ children, title = "Window", onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      left: '100px',
      width: '400px',
      height: '300px',
      backgroundColor: '#c0c0c0',
      border: '2px outset #c0c0c0',
      fontFamily: 'monospace',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#000080',
        color: 'white',
        padding: '4px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{title}</span>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#c0c0c0',
              border: '1px outset #c0c0c0',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}
      </div>
      <div style={{ padding: '8px', height: 'calc(100% - 32px)', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export default SimpleWindow; 