// src/pages/HomePage.jsx
import React from 'react'; // Import React if using JSX transform older than automatic

function HomePage() {
  return (
    // Using tui-window for consistent section styling
    <div className="tui-window" style={{ marginTop: '20px', minHeight: '400px' }}>
      <h2 className="tui-title">C:\HOME&gt; SYSTEM ONLINE</h2>
      <div className="tui-panel">
        <p>WEYLAND CORP TERMINAL INTERFACE v3.9.96</p> {/* Subtle nod to 1996 & age */}
        <p>ACCESS GRANTED. USER: GUEST</p>
        <p>----------------------------------------------------------------------</p>
        <p>Initializing data streams...</p>
        <div className="tui-progress" data-value="25" data-label="CORE SYS: 25%"></div>
        <p style={{marginTop: '10px'}}>Establishing secure connection...</p>
        <div className="tui-progress" data-value="50" data-label="NETWORK: 50%"></div>
        <p style={{marginTop: '10px'}}>Loading archival data...</p>
        <div className="tui-progress" data-value="75" data-label="ARCHIVES: 75%"></div>
        <p style={{marginTop: '10px'}}>SYSTEM READY. AWAITING DIRECTIVE.</p>
        <p>----------------------------------------------------------------------</p>
        <p>
          Welcome. This node provides access to curated data streams, project
          archives, and operational schematics.
        </p>
        <p>
          Navigate via the directory links or engage the Command Line Interface (CLI)
          for advanced queries.
        </p>
        <p>
          Our objective: <em>Building Better Worlds... one byte at a time.</em>
        </p>
        <br />
        <p>C:\HOME&gt; _</p> {/* Blinking cursor illusion */}
      </div>
    </div>
  );
}

export default HomePage;