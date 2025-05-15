import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // We'll create this CSS file next

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <p>C:\&gt; WEYLAND_NAV</p>
        <p>Bad command or file name</p>
        <p><br /></p>
        <p>C:\&gt; DIR /PAGE_NOT_FOUND</p>
        <p>Volume in drive C is WEYLAND_OS</p>
        <p>Volume Serial Number is 1996-2077</p>
        <p>File not found</p>
        <p><br /></p>
        <p>C:\&gt; <span className="cursor">_</span></p> {/* Simulate cursor with blinking */}
        <p><br /></p>
        <p>Return to <Link to="/" className="not-found-link">HOME DIRECTORY</Link>? (Y/N)</p>
      </div>
    </div>
  );
}

export default NotFoundPage; 