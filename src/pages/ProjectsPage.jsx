// src/pages/ProjectsPage.jsx
import React from 'react';

const retroProjects = [
  "NOVA-STRIKE Utilities Suite v2.1",
  "CYBERGLYPH Font Engine (Shareware)",
  "PIXELWEAVER Deluxe Paint Studio",
  "SOUNDWAVE MOD Tracker Gold",
  "NIGHTOWL BBS Door Kit",
  "HEXEDIT Pro 97",
  "NEURAL-NET Chess AI (Experimental)",
  "STARMAP Navigator v3.0 (Celestial DB)",
  "CODECRUNCH Packer/Unpacker",
  "VIRTUA-DESK Desktop Enhancer",
  "RAYTRACE Master 3D Renderer",
  "PACKETSNIFF Network Monitor (Freeware)",
  "DOS SHELL X-TREME Commander",
  "FRACTAL GENIUS 2000",
  "MIDI MAESTRO Sequencer",
  "ASTRO-BLITZ Arcade (Source Included)",
  "TEXTMORPH Text Editor FX",
  "DIAL-UP Daemon Connection Manager",
  "ENIGMA CRYPT File Encryptor",
  "BIO-SCANNER System Analyzer",
  "GEOSCAPE Terrain Generator",
  "LOGICBOMB Virus Simulator (Educational)",
  "TIMESHIFT Scheduler Pro",
  "QUANTUM LEAP File Manager"
];

function ProjectsPage() {
  return (
    <section id="projects" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\ARCHIVES\PROJECTS_OLD</h2>
       <div className="tui-panel" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
         <p>Accessing archived project manifests...</p>
         <p>Listing recovered development titles:</p>
         <br />
         <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}>
           {retroProjects.map((projectName, index) => (
             <li key={index} style={{ marginBottom: '5px' }}>
               &gt; {projectName}
             </li>
           ))}
         </ul>
         <br />
         <p>--- End of Listing ---</p>
       </div>
    </section>
  );
}

export default ProjectsPage;