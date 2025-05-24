// src/pages/HomePage.jsx
import React from 'react'; // Import React if using JSX transform older than automatic
import useTypewriter from '../hooks/useTypewriter'; // Import the custom hook

function HomePage() {
  const pageKey = 'visits_home'; // Unique key for this page

  // Define the full text for the paragraphs we want to animate
  const welcomeText = "Welcome. This node provides access to curated data streams, project archives, and operational schematics.";
  const navigateText = "Navigate via the directory links or engage the Command Line Interface (CLI) for advanced queries.";
  const objectiveText = "Our objective: Building Better Worlds... one byte at a time.";

  // Pass the pageKey to the hook
  const typedWelcomeText = useTypewriter(welcomeText, 25, `${pageKey}_welcome`);
  const typedNavigateText = useTypewriter(navigateText, 25, `${pageKey}_navigate`);
  const typedObjectiveText = useTypewriter(objectiveText, 25, `${pageKey}_objective`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Main Welcome Window */}
      <div className="tui-window" style={{ minHeight: '400px' }}>
        <h2 className="tui-title">🏠 C:\HOME&gt; SYSTEM ONLINE</h2>
        <div className="tui-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ fontSize: '1.5em' }}>🖥️</span>
            <strong>WEYLAND CORP TERMINAL INTERFACE v3.9.96</strong>
          </div>
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
            {typedWelcomeText}
            {typedWelcomeText !== welcomeText ? '_' : ''}
          </p>
          <p>
            {typedNavigateText}
            {typedNavigateText !== navigateText ? '_' : ''}
          </p>
          <p>
            <em>{typedObjectiveText}</em>
            {typedObjectiveText !== objectiveText ? '_' : ''}
          </p>
          <br />
          <p>C:\HOME&gt;<span className="blinking-cursor-element">_</span></p>
        </div>
      </div>

      {/* Quick Access Panel */}
      <div className="tui-window" style={{ minHeight: '200px' }}>
        <h2 className="tui-title">⚡ QUICK ACCESS PANEL</h2>
        <div className="tui-panel">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '10px' }}>
            <div style={{ padding: '10px', border: '1px inset #c0c0c0', backgroundColor: 'rgba(255,255,255,0.5)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#000080' }}>🖥️ Desktop Environment</h4>
              <p style={{ fontSize: '0.9em', margin: '0' }}>Double-click desktop icons to launch applications. Drag windows, resize, minimize, and maximize for a full retro experience.</p>
            </div>
            <div style={{ padding: '10px', border: '1px inset #c0c0c0', backgroundColor: 'rgba(255,255,255,0.5)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#000080' }}>💻 DOS Terminal</h4>
              <p style={{ fontSize: '0.9em', margin: '0' }}>Access the command line interface with commands like 'dir', 'cd', 'type', and navigate to different sections.</p>
            </div>
            <div style={{ padding: '10px', border: '1px inset #c0c0c0', backgroundColor: 'rgba(255,255,255,0.5)' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#000080' }}>🗂️ File Manager</h4>
              <p style={{ fontSize: '0.9em', margin: '0' }}>Browse the virtual file system with the integrated file manager. View files and directories in classic Windows style.</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Window */}
      <div className="tui-window">
        <h2 className="tui-title">📊 SYSTEM STATUS</h2>
        <div className="tui-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <strong>🔋 Power Status:</strong> <span style={{ color: '#008000' }}>OPTIMAL</span><br/>
              <strong>🌐 Network:</strong> <span style={{ color: '#008000' }}>CONNECTED</span><br/>
              <strong>🛡️ Security:</strong> <span style={{ color: '#ff8000' }}>MONITORING</span>
            </div>
            <div>
              <strong>💾 Memory:</strong> <span style={{ color: '#008000' }}>512MB Available</span><br/>
              <strong>💿 Storage:</strong> <span style={{ color: '#008000' }}>2.1GB Free</span><br/>
              <strong>🕐 Uptime:</strong> <span style={{ color: '#008000' }}>72 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;