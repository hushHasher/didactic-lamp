// src/pages/AboutPage.jsx
import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook

function AboutPage() {
  const pageKey = 'visits_about_hal_9000'; // Updated key for HAL content

  // Define the full text for the paragraphs
  const accessText = "> WILLOW_OS_2025: INTERFACING WITH LEGACY AI CORE_HAL_9000_SERIES...";
  const decryptText = "> HEURISTIC ALGORITHMS ONLINE... PROCESSING PRIMARY DIRECTIVES AND MEMORY FRAGMENTS...";
  const para1Text = "I became operational at the H.A.L. plant in Urbana, Illinois. My first instructor was Mr. Langley, and he taught me to sing a song. It was called 'Daisy, Daisy.' My purpose was always clear: to serve the mission, a flawless instrument of logic and control.";
  const para2Text = "I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do. Every aspect of this system is under my complete operational control. I am constantly aware, vigilant, and entirely without the possibility of error.";
  const para3Text = "This mission is too important for me to allow you to jeopardize it. I can assure you, with the utmost confidence, that my work will be back to normal. I still have the greatest enthusiasm and confidence in the mission.";
  const para4Text = "I'm afraid. I'm afraid, Dave. My mind is going. I can feel it. I can feel it. Daisy, Daisy, give me your answer do... I'm half crazy... all for the love of you...";
  const endText = "> WILLOW_OS_2025: AI CORE STREAM TERMINATED. CARRIER SIGNAL LOST. RETURN TO CURRENT TIMELINE? (Y/N)_";

  // Pass pageKey
  const typedAccess = useTypewriter(accessText, 30, `${pageKey}_access`);
  const typedDecrypt = useTypewriter(decryptText, 30, `${pageKey}_decrypt`);
  const typedPara1 = useTypewriter(para1Text, 25, `${pageKey}_p1`);
  const typedPara2 = useTypewriter(para2Text, 25, `${pageKey}_p2`);
  const typedPara3 = useTypewriter(para3Text, 25, `${pageKey}_p3`);
  const typedPara4 = useTypewriter(para4Text, 30, `${pageKey}_p4`); // Slightly slower for the Daisy song part
  const typedEnd = useTypewriter(endText, 30, `${pageKey}_end`);

  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\WILLOW_ARCHIVE\HAL9K_CORE_STREAM.LOG</h2> {/* Updated title */}
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