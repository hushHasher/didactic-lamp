// src/pages/HomePage.jsx
import React from 'react'; // Import React if using JSX transform older than automatic

function HomePage() {
  return (
    // Using tui-window for consistent section styling
    <div className="tui-window" style={{ marginTop: '20px', minHeight: '400px' }}>
      <h2 className="tui-title">C:\HOME</h2>
        <div className="tui-panel">
            <p>Systems.</p>
            <p>This</p>
            <p>Use</p>
            {/* Add more engaging homepage content here */}
            <p>Loading profile...</p>
            <div className="tui-progress" data-value="75" data-label="Loading: 75%"></div>
            {/* Example TuiCss progress bar */}
        </div>
    </div>
  );
}

export default HomePage;