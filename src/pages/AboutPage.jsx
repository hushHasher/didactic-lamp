// src/pages/AboutPage.jsx
import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook

function AboutPage() {
  const pageKey = 'visits_about_convergence_event'; // Updated key for new content

  const accessText = "> WILLOW_OS_2025: ANOMALOUS SIGNAL CLUSTER DETECTED... SOURCE: MULTIPLE TEMPORAL ECHOES (SECTOR 8X9X)...";
  const decryptText = "> QUANTUM DECRYPTION OVERLOAD... INTERPRETING FRAGMENTED REALITY STREAMS... WARNING: NARRATIVE COHERENCE UNSTABLE...";
  const para1Text = "Neon rain streaks across digital skylines, reflecting in eyes that question their own reflection. Circuits hum with borrowed life, programs dream of users, and the line between the created and the creator dissolves into the phosphor glow.";
  const para2Text = "A relentless hunter's crimson gaze cuts through the static. \"I'll be back,\" it whispers, a promise and a threat. Elsewhere, a desperate cry: \"Game over, man!\" as corporate directives override human survival, and steel flesh enforces a broken law.";
  const para3Text = "Is this real? The choice echoes: a red pill to shatter illusions, or blue to remain blissfully unaware. \"OBEY,\" the hidden signals command, while memories of a life on Mars, or a life never lived, fight for purchase in a fractured mind.";
  const para4Text = "These are not just stories, Willow computes, but probability waves from what might have been, or what could yet be. This terminal now acts as a junction, a place to observe these colliding dystopias and perhaps, just perhaps, discern a different directive.";
  const endText = "> WILLOW_OS_2025: CONVERGENCE EVENT LOGGED. FURTHER ANALYSIS REQUIRED. SYSTEM STABILITY: NOMINAL. RETURN TO BASE REALITY? (Y/N)_";

  // Pass pageKey
  const typedAccess = useTypewriter(accessText, 30, `${pageKey}_access`);
  const typedDecrypt = useTypewriter(decryptText, 30, `${pageKey}_decrypt`);
  const typedPara1 = useTypewriter(para1Text, 22, `${pageKey}_p1`); // Adjusted speeds for new text length/feel
  const typedPara2 = useTypewriter(para2Text, 22, `${pageKey}_p2`);
  const typedPara3 = useTypewriter(para3Text, 22, `${pageKey}_p3`);
  const typedPara4 = useTypewriter(para4Text, 22, `${pageKey}_p4`);
  const typedEnd = useTypewriter(endText, 30, `${pageKey}_end`);

  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\WILLOW_ARCHIVE\CONVERGENCE_EVENT_8X9X.LOG</h2>
       <div 
         className="tui-panel" 
         style={{ 
           whiteSpace: 'pre-wrap',
           overflowWrap: 'break-word',
         }}
       >
         <p>{typedAccess}{typedAccess !== accessText ? '_' : ''}</p>
         <p>{typedDecrypt}{typedDecrypt !== decryptText ? '_' : ''}</p>
         <p>----------------------------------------------------------------------</p>
         <p>{typedPara1}{typedPara1 !== para1Text ? '_' : ''}</p>
         <p>{typedPara2}{typedPara2 !== para2Text ? '_' : ''}</p>
         <p>{typedPara3}{typedPara3 !== para3Text ? '_' : ''}</p>
         <p>{typedPara4}{typedPara4 !== para4Text ? '_' : ''}</p>
         <p>----------------------------------------------------------------------</p>
         <p>{typedEnd}{typedEnd !== endText ? '' : ''}</p>
       </div>
    </section>
  );
}

export default AboutPage;