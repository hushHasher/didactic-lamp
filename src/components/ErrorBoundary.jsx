import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff0000',
          borderRadius: '8px',
          backgroundColor: '#ffe6e6',
          fontFamily: '"Perfect DOS VGA", "Lucida Console", "Courier New", monospace'
        }}>
          <h2 style={{ color: '#cc0000', marginTop: 0 }}>🚨 SYSTEM ERROR DETECTED</h2>
          <p style={{ color: '#000000' }}>
            <strong>WEYLAND CORP DIAGNOSTIC:</strong> An unexpected error occurred in the application.
          </p>
          <details style={{ marginTop: '10px', color: '#000000' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Technical Details (Click to expand)
            </summary>
            <pre style={{ 
              backgroundColor: '#f0f0f0', 
              padding: '10px', 
              marginTop: '10px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#c0c0c0',
              border: '2px outset #c0c0c0',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            🔄 Restart Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary; 