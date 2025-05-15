// src/pages/AboutPage.jsx
import React from 'react';
// import useTypewriter from '../hooks/useTypewriter'; // Temporarily commented out

function AboutPage() {
  // const pageKey = 'visits_about_space_odyssey'; // Not needed for static text

  const accessText = "> WILLOW_OS_2025: ANOMALOUS SIGNAL CLUSTER DETECTED... SOURCE: MULTIPLE TEMPORAL ECHOES (SECTOR 8X9X)...";
  const decryptText = "> QUANTUM DECRYPTION OVERLOAD... INTERPRETING FRAGMENTED REALITY STREAMS... WARNING: NARRATIVE COHERENCE UNSTABLE...";
  const para1Text = "Neon rain streaks across digital skylines, reflecting in eyes that question their own reflection. Circuits hum with borrowed life, programs dream of users, and the line between the created and the creator dissolves into the phosphor glow.";
  const para2Text = "A relentless hunter's crimson gaze cuts through the static. \"I'll be back,\" it whispers, a promise and a threat. Elsewhere, a desperate cry: \"Game over, man!\" as corporate directives override human survival, and steel flesh enforces a broken law.";
  const para3Text = "Is this real? The choice echoes: a red pill to shatter illusions, or blue to remain blissfully unaware. \"OBEY,\" the hidden signals command, while memories of a life on Mars, or a life never lived, fight for purchase in a fractured mind.";
  const para4Text = "These are not just stories, Willow computes, but probability waves from what might have been, or what could yet be. This terminal now acts as a junction, a place to observe these colliding dystopias and perhaps, just perhaps, discern a different directive.";
  const endText = "> WILLOW_OS_2025: CONVERGENCE EVENT LOGGED. FURTHER ANALYSIS REQUIRED. SYSTEM STABILITY: NOMINAL. RETURN TO BASE REALITY? (Y/N)";

  // Temporarily using static text instead of typewriter hooks
  const typedAccess = accessText;
  const typedDecrypt = decryptText;
  const typedPara1 = para1Text;
  const typedPara2 = para2Text;
  const typedPara3 = para3Text;
  const typedPara4 = para4Text;
  const typedEnd = endText;

  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\WILLOW_ARCHIVE\STAR_GATE_MANIFEST.LOG</h2>
       <div 
         className="tui-panel" 
         style={{ 
           whiteSpace: 'pre-wrap',
           overflowWrap: 'break-word',
         }}
       >
         <p>{typedAccess}</p> {/* Removed typewriter cursor logic */}
         <p>{typedDecrypt}</p>
         <p>----------------------------------------------------------------------</p>
         <p>{typedPara1}</p>
         <p>{typedPara2}</p>
         <p>{typedPara3}</p>
         <p>{typedPara4}</p>
         <p>----------------------------------------------------------------------</p>
         <p>
           {typedEnd}
           {/* Static blinking cursor for the end prompt as it was before */}
           <span className="blinking-cursor-element">_</span>
         </p>
       </div>
    </section>
  );
}

export default AboutPage;