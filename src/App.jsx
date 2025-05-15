// src/App.jsx - Padding adjustments
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Router components
import DosTerminal from './DosTerminal';
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

  return (
    <div className="App"> {/* Main layout container */}

      {/* --- Navigation Bar --- */}
      <nav className="tui-panel main-nav" style={{ padding: '5px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Left side: Logo + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <img
              src="logo_rim.png"
              alt="Weyland Corp Logo"
              className="navbar-logo"
            />
            {/* Use stable closeMobileMenu */}
            <Link to="/" className="tui-title" style={{fontSize: '1.1em', textDecoration: 'none', color: 'inherit'}} onClick={closeMobileMenu}>
             WEYLAND CORP
            </Link>
          </div>

          {/* Hamburger Button (Mobile Only - controlled by CSS) */}
          {/* Use stable toggleMobileMenu */}
          <button className="tui-button mobile-menu-button" onClick={toggleMobileMenu} aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}>
            ☰
          </button>

          {/* Right side links (Desktop Only - controlled by CSS) */}
          <ul className="desktop-nav-links" style={{ listStyle: 'none', margin: 0, padding: 0, gap: '10px' }}>
            <li><Link to="/" className="tui-button">Home</Link></li>
            <li><Link to="/about" className="tui-button">About</Link></li>
            <li><Link to="/projects" className="tui-button">Projects</Link></li>
            {/* <li><Link to="/contact" className="tui-button">Contact</Link></li> */}
            <li>
              {/* Use stable toggleTerminal */}
              <button className="tui-button" onClick={toggleTerminal} aria-pressed={showTerminal}>
                {showTerminal ? 'CLI [X]' : 'CLI [_]'}
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul style={{ listStyle: 'none', margin: '10px 0 0 0', padding: 0 }}>
            <li><Link to="/" className="tui-button mobile-link" onClick={closeMobileMenu}>Home</Link></li>
            <li><Link to="/about" className="tui-button mobile-link" onClick={closeMobileMenu}>About</Link></li>
            <li><Link to="/projects" className="tui-button mobile-link" onClick={closeMobileMenu}>Projects</Link></li>
            {/* <li><Link to="/contact" className="tui-button mobile-link" onClick={closeMobileMenu}>Contact</Link></li> */}
            <li>
              {/* Use stable toggleTerminalAndMenu */}
              <button className="tui-button mobile-link" onClick={toggleTerminalAndMenu} aria-pressed={showTerminal}>
                {showTerminal ? 'Close CLI' : 'Launch CLI'}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {/* --- End Navigation Bar --- */}


      {/* --- Main Content Area (Where Pages Render) --- */}
      {/* MODIFIED: Removed inline style for padding */}
      <main>
        {/* --- Define Page Routes --- */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          {/* <Route path="/contact" element={<ContactPage />} /> */}
          {/* <Route path="*" element={<div>404 - Page Not Found</div>} /> */}
          <Route path="*" element={<NotFoundPage />} /> {/* ADDED: Catch-all route for 404 */}
        </Routes>
        {/* --- End Page Routes --- */}
      </main>
      {/* --- End Main Content Area --- */}

      {/* --- Footer --- */}
      <FooterClock />
      {/* --- End Footer --- */}

      {/* --- Conditionally render the terminal OUTSIDE main flow --- */}
      {showTerminal && (
        <div className="terminal-container">
          <DosTerminal onClose={toggleTerminal} shouldFocusOnOpen={focusTerminalNextOpen} />
        </div>
      )}

    </div> // Closes <div className="App">
  );
}

export default App;