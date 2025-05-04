// src/pages/AboutPage.jsx
import React from 'react';

function AboutPage() {
  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\ABOUT</h2>
       <div className="tui-panel">
         <p>Welcome! This is my portfolio website, built with React and styled to look like MS-DOS using TuiCss.</p>
         <p>I am a developer specializing in [Your Specialization, e.g., Front-end, Full-stack, etc.] based in Bolton, UK.</p>
         <p>My passion lies in creating [mention types of projects or goals]. I enjoy working with technologies like React, Node.js, and exploring unique user interfaces.</p>
         {/* Add more paragraphs about your background, skills, philosophy */}
       </div>
    </section>
  );
}

export default AboutPage;