// src/App.jsx - Enhanced with Desktop Environment
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Router components
import DosTerminal from './DosTerminal';
import AiDosTerminal from './components/AiDosTerminal'; // Import AI DOS Terminal
import Desktop from './components/Desktop'; // Import Desktop component
import HomePage from './pages/HomePage'; // Import page components
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import NotFoundPage from './pages/NotFoundPage'; // ADDED: Import NotFoundPage
import FooterClock from './components/FooterClock'; // Import the new component
import BootSequence from './components/BootSequence'; // ADDED: Import BootSequence
import './App.css'; // Main layout styles

function App() {
  // ADDED: State for boot sequence
  const [booting, setBooting] = useState(true);
  
  // ADDED: State for desktop mode vs web mode
  const [desktopMode, setDesktopMode] = useState(true);

  // ADDED: State for AI DOS mode
  const [aiDosMode, setAiDosMode] = useState(false);

  // State for Terminal Visibility
  const [showTerminal, setShowTerminal] = useState(false);
  // State for Mobile Menu Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [focusTerminalNextOpen, setFocusTerminalNextOpen] = useState(false); // ADDED: State for focus trigger

  // Wrap toggleTerminal with useCallback to give it a stable identity
  const toggleTerminal = useCallback(() => {
    setShowTerminal(prevState => {
      const nextState = !prevState;
      if (nextState) { // If terminal is being opened
        setFocusTerminalNextOpen(true);
      }
      return nextState;
    });
  }, []);

  // Handler to toggle between desktop and web mode
  const toggleDesktopMode = useCallback(() => {
    setDesktopMode(prevState => !prevState);
    setAiDosMode(false); // Exit AI DOS when switching to desktop/web mode
  }, []);

  // Handler to toggle AI DOS mode
  const toggleAiDosMode = useCallback(() => {
    setAiDosMode(prevState => {
      const newAiDosMode = !prevState;
      if (newAiDosMode) {
        setDesktopMode(false); // Exit desktop mode when entering AI DOS
      }
      return newAiDosMode;
    });
  }, []);

  // Handler to toggle mobile menu
  const toggleMobileMenu = useCallback(() => { // Also good practice to wrap this
    setIsMobileMenuOpen(prevState => !prevState);
  }, []);

  // Function to close mobile menu (used by links)
  const closeMobileMenu = useCallback(() => { // And this
    setIsMobileMenuOpen(false);
  }, []);

  // Function to handle CLI toggle from mobile menu
  const toggleTerminalAndMenu = useCallback(() => { // And this
    // setShowTerminal will trigger focusTerminalNextOpen logic via toggleTerminal
    toggleTerminal();
    closeMobileMenu();
  }, [toggleTerminal, closeMobileMenu]);

  // ADDED: Callback for when boot sequence is complete
  const handleBootComplete = useCallback(() => {
    setBooting(false);
  }, []);

  // ADDED: useEffect to reset focusTerminalNextOpen after it has been consumed
  useEffect(() => {
    if (showTerminal && focusTerminalNextOpen) {
      // After DosTerminal has received shouldFocusOnOpen={true} and (presumably) acted on it,
      // reset the trigger so it doesn't re-focus on subsequent App re-renders while terminal is still open.
      setFocusTerminalNextOpen(false);
    }
  }, [showTerminal, focusTerminalNextOpen]);

  // ADDED: Conditional rendering for boot sequence
  if (booting) {
    return <BootSequence onBootComplete={handleBootComplete} />;
  }

  // ADDED: If in desktop mode, show only the desktop
  if (desktopMode) {
    return (
      <>
        <Desktop />
        {/* Floating toggle button to switch to web mode */}
        <button 
          onClick={toggleDesktopMode}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 2000,
            padding: '8px 12px',
            backgroundColor: '#c0c0c0',
            border: '2px outset #c0c0c0',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'sans-serif'
          }}
        >
          🌐 Web Mode
        </button>
        
        {/* --- Conditionally render the terminal OUTSIDE main flow --- */}
        {showTerminal && (
          <div className="terminal-container">
            <DosTerminal onClose={toggleTerminal} shouldFocusOnOpen={focusTerminalNextOpen} />
          </div>
        )}
      </>
    );
  }

  // ADDED: If in AI DOS mode, show AI DOS interface
  if (aiDosMode) {
    return (
      <>
        <AiDosTerminal onClose={() => setAiDosMode(false)} />
        {/* Floating toggle buttons - moved to top-left to avoid overlap */}
        <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 2000, display: 'flex', gap: '8px' }}>
          <button 
            onClick={toggleDesktopMode}
            style={{
              padding: '8px 12px',
              backgroundColor: '#c0c0c0',
              border: '2px outset #c0c0c0',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'sans-serif'
            }}
          >
            🖥️ Desktop
          </button>
          <button 
            onClick={() => setAiDosMode(false)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#c0c0c0',
              border: '2px outset #c0c0c0',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'sans-serif'
            }}
          >
            🌐 Web Mode
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="App"> {/* Main layout container */}

        {/* --- Navigation Bar --- */}
        <nav className="tui-panel main-nav enhanced-nav" style={{ padding: '8px 15px', flexShrink: 0, position: 'relative', zIndex: 1001 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* Left side: Logo + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <img
                src="logo_rim.png"
                alt="Weyland Corp Logo"
                className="navbar-logo enhanced-logo"
              />
              {/* Use stable closeMobileMenu */}
              <Link to="/" className="tui-title enhanced-title" style={{fontSize: '1.2em', textDecoration: 'none', color: 'inherit', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}} onClick={closeMobileMenu}>
               WEYLAND CORP
              </Link>
            </div>

            {/* System Status Indicator */}
            <div className="system-status" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8em', color: '#00ff00' }}>
              <span>●</span>
              <span>SYSTEM ONLINE</span>
            </div>

            {/* Hamburger Button (Mobile Only - controlled by CSS) */}
            {/* Use stable toggleMobileMenu */}
            <button className="tui-button mobile-menu-button enhanced-mobile-btn" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
              ☰
            </button>

            {/* Right side links (Desktop Only - controlled by CSS) */}
            <ul className="desktop-nav-links enhanced-nav-links" style={{ listStyle: 'none', margin: 0, padding: 0, gap: '12px' }}>
              <li><Link to="/" className="tui-button enhanced-nav-btn">🏠 Home</Link></li>
              <li><Link to="/about" className="tui-button enhanced-nav-btn">📋 About</Link></li>
              <li><Link to="/projects" className="tui-button enhanced-nav-btn">📁 Projects</Link></li>
              <li>
                <button className="tui-button enhanced-nav-btn" onClick={toggleDesktopMode}>
                  🖥️ Desktop
                </button>
              </li>
              <li>
                <button className="tui-button enhanced-nav-btn" onClick={toggleAiDosMode}>
                  🤖 AI DOS
                </button>
              </li>
              <li>
                {/* Use stable toggleTerminal */}
                <button className="tui-button enhanced-nav-btn terminal-btn" onClick={toggleTerminal} aria-pressed={showTerminal}>
                  {showTerminal ? '💻 CLI [ON]' : '💻 CLI [OFF]'}
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`mobile-menu enhanced-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <ul style={{ listStyle: 'none', margin: '15px 0 0 0', padding: 0 }}>
              <li><Link to="/" className="tui-button mobile-link enhanced-mobile-link" onClick={closeMobileMenu}>🏠 Home</Link></li>
              <li><Link to="/about" className="tui-button mobile-link enhanced-mobile-link" onClick={closeMobileMenu}>📋 About</Link></li>
              <li><Link to="/projects" className="tui-button mobile-link enhanced-mobile-link" onClick={closeMobileMenu}>📁 Projects</Link></li>
              <li>
                <button className="tui-button mobile-link enhanced-mobile-link" onClick={() => { toggleDesktopMode(); closeMobileMenu(); }}>
                  🖥️ Desktop
                </button>
              </li>
              <li>
                <button className="tui-button mobile-link enhanced-mobile-link" onClick={() => { toggleAiDosMode(); closeMobileMenu(); }}>
                  🤖 AI DOS
                </button>
              </li>
              <li>
                {/* Use stable toggleTerminalAndMenu */}
                <button className="tui-button mobile-link enhanced-mobile-link" onClick={toggleTerminalAndMenu} aria-pressed={showTerminal}>
                  {showTerminal ? '💻 Close CLI' : '💻 Launch CLI'}
                </button>
              </li>
            </ul>
          </div>
        </nav>
        {/* --- End Navigation Bar --- */}


        {/* --- Main Content Area (Where Pages Render) --- */}
        <main className="enhanced-main">
          {/* --- Define Page Routes --- */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {/* --- End Page Routes --- */}
        </main>
        {/* --- End Main Content Area --- */}

        {/* --- Enhanced Footer --- */}
        <FooterClock />
        {/* --- End Footer --- */}

        {/* --- Conditionally render the terminal OUTSIDE main flow --- */}
        {showTerminal && (
          <div className="terminal-container">
            <DosTerminal onClose={toggleTerminal} shouldFocusOnOpen={focusTerminalNextOpen} />
          </div>
        )}

      </div> {/* Closes <div className="App"> */}
    </>
  );
}

export default App;