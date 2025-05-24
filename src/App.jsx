// src/App.jsx - Enhanced with Desktop Environment
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Router components
import DosTerminal from './DosTerminal';
import ErrorBoundary from './components/ErrorBoundary.jsx'; // Import ErrorBoundary
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
  const [booting, setBooting] = useState(false);

  // State for Terminal Visibility
  const [showTerminal, setShowTerminal] = useState(false);
  // State for Mobile Menu Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Wrap toggleTerminal with useCallback to give it a stable identity
  const toggleTerminal = useCallback(() => {
    setShowTerminal(prevState => !prevState);
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

  // ADDED: Conditional rendering for boot sequence
  if (booting) {
    return <BootSequence onBootComplete={handleBootComplete} />;
  }

  return (
    <>
      <Desktop />
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
          <ErrorBoundary>
            {/* --- Define Page Routes --- */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            {/* --- End Page Routes --- */}
          </ErrorBoundary>
        </main>
        {/* --- End Main Content Area --- */}

        {/* --- Enhanced Footer --- */}
        <FooterClock />
        {/* --- End Footer --- */}

        {/* --- Conditionally render the terminal OUTSIDE main flow --- */}
        {showTerminal && (
          <ErrorBoundary>
            <div className="terminal-container">
              <DosTerminal onClose={toggleTerminal} /> {/* shouldFocusOnOpen prop removed */}
            </div>
          </ErrorBoundary>
        )}

      </div> {/* Closes <div className="App"> */}
    </>
  );
}

export default App;