// src/components/MobileMenu.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function MobileMenu({ isOpen, closeMenu, toggleTerminalAndMenu, showTerminal }) {
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <nav aria-label="Mobile navigation">
        <ul style={{ listStyle: 'none', margin: '10px 0 0 0', padding: 0 }}>
          <li><Link to="/" className="tui-button mobile-link" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" className="tui-button mobile-link" onClick={closeMenu}>About</Link></li>
          <li><Link to="/projects" className="tui-button mobile-link" onClick={closeMenu}>Projects</Link></li>
          {/* <li><Link to="/contact" className="tui-button mobile-link" onClick={closeMenu}>Contact</Link></li> */}
          <li>
            <button
              className="tui-button mobile-link"
              onClick={toggleTerminalAndMenu}
              aria-pressed={showTerminal}
              aria-label="Toggle Command Line Interface"
            >
              {showTerminal ? 'Close CLI' : 'Launch CLI'}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
  toggleTerminalAndMenu: PropTypes.func.isRequired,
  showTerminal: PropTypes.bool.isRequired,
};

export default MobileMenu;
