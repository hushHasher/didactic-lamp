// src/pages/HomePage.jsx
import React from 'react'; // Import React if using JSX transform older than automatic

function HomePage() {
  return (
    // Using tui-window for consistent section styling
    <div className="tui-window" style={{ marginTop: '20px', minHeight: '400px' }}>
      <h2 className="tui-title">C:\HOME</h2>
        <div className="tui-panel">
            <p>Welcome to RBM Systems.</p>
            <p>This site showcases my projects and skills, presented with a retro MS-DOS aesthetic using React and TuiCss.</p>
            <p>Use the navigation above or launch the CLI for more interaction.</p>
            {/* Add more engaging homepage content here */}
            <p>Loading user profile...</p>
            <div className="tui-progress" data-value="75" data-label="Loading: 75%"></div>
            {/* Example TuiCss progress bar */}
        </div>
    </div>
  );
}

export default HomePage;