// src/pages/ProjectsPage.jsx
import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook

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
  // Define text for intro lines
  const intro1Text = "Accessing archived project manifests...";
  const intro2Text = "Listing recovered development titles:";

  // Apply hook
  const typedIntro1 = useTypewriter(intro1Text, 40);
  const typedIntro2 = useTypewriter(intro2Text, 40);

  // Determine if typing is complete to show the list
  const typingComplete = typedIntro1.length === intro1Text.length && typedIntro2.length === intro2Text.length;

  return (
    <section id="projects" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\ARCHIVES\PROJECTS_OLD</h2>
       <div className="tui-panel" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
         {/* Render typed intro text */}
         <p>{typedIntro1}{typedIntro1.length < intro1Text.length ? '_' : ''}</p>
         <p>{typedIntro2}{typedIntro2.length < intro2Text.length ? '_' : ''}</p>
         <br />

         {/* Only render the list and end text once the intro is done typing */}
         {typingComplete && (
           <>
             <ul style={{ listStyleType: 'none', paddingLeft: '10px' }}>
               {retroProjects.map((projectName, index) => (
                 <li key={index} style={{ marginBottom: '5px' }}>
                   &gt; {projectName}
                 </li>
               ))}
             </ul>
             <br />
             <p>--- End of Listing ---</p>
           </>
         )}
       </div>
    </section>
  );
}

export default ProjectsPage;