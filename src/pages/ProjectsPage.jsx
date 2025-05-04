// src/pages/ProjectsPage.jsx
import React from 'react';

function ProjectsPage() {
  return (
    <section id="projects" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\PROJECTS</h2>
       <div className="tui-panel">
         <p>Here are some of the projects I've worked on:</p>
         <ul>
            <li>Project 1: A brief description of the project. Maybe link to GitHub or a live demo.</li>
            <li>Project 2: Another project description...</li>
            <li>Project 3: And another...</li>
            {/* Add your actual projects */}
         </ul>
       </div>
    </section>
  );
}

export default ProjectsPage;