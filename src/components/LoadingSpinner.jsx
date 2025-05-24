import React from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

function LoadingSpinner({ message = "Loading...", size = "medium" }) {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner">
        <div className="spinner-block">█</div>
        <div className="spinner-block">█</div>
        <div className="spinner-block">█</div>
        <div className="spinner-block">█</div>
      </div>
      <div className="loading-message">{message}</div>
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default LoadingSpinner; 