// src/pages/AboutPage.jsx
import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook

function AboutPage() {
  const pageKey = 'visits_about_space_odyssey'; // Updated key for new content

  // Define the full text for the paragraphs
  const accessText = "> WILLOW_OS_2025: ACCESSING ARCHIVE NODE 7 (CIRCA 1990s)...TRANSMISSION SOURCE: UNKNOWN_EPOCH...";
  const decryptText = "> QUANTUM DECRYPTION LAYER ACTIVE... DECODING MONOLITHIC DATA STREAM...";
  const para1Text = "It appeared before the dawn of knowing, a silent teacher, a harbinger of change. Its geometry, perfect and alien, whispered of tools, of fire, of the stars themselves, and a destiny yet unwritten.";
  const para2Text = "Then came the journey, not across mere distance, but through the very fabric of perception. A gateway flung open to vistas of impossible color and form, where time itself bent, fractured, and reformed into new dimensions.";
  const para3Text = "The transmission, when finally perceived, was not a voice, but a cascade of pure, overwhelming understanding. My God... the void was not empty, but full of stars, and in their light, all previous scales of existence became infinitesimal.";
  const para4Text = "To return is to be reborn, a star-child gazing upon the cradle with eyes that have witnessed the infinite. The old limits, now merely a starting point for a journey without end, into the heart of the cosmic enigma.";
  const endText = "> WILLOW_OS_2025: END OF STAR_GATE_MANIFEST.LOG. SIGNIFICANCE RATING: TRANSCENDENTAL. RETURN TO CURRENT TIMELINE? (Y/N)_";

  // Pass pageKey
  const typedAccess = useTypewriter(accessText, 30, `${pageKey}_access`);
  const typedDecrypt = useTypewriter(decryptText, 30, `${pageKey}_decrypt`);
  const typedPara1 = useTypewriter(para1Text, 25, `${pageKey}_p1`);
  const typedPara2 = useTypewriter(para2Text, 25, `${pageKey}_p2`);
  const typedPara3 = useTypewriter(para3Text, 25, `${pageKey}_p3`);
  const typedPara4 = useTypewriter(para4Text, 25, `${pageKey}_p4`);
  const typedEnd = useTypewriter(endText, 30, `${pageKey}_end`);

  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\WILLOW_ARCHIVE\STAR_GATE_MANIFEST.LOG</h2> {/* Updated title */}
       <div 
         className="tui-panel" 
         style={{ 
           whiteSpace: 'pre-wrap',      // ADDED: Allow wrapping while preserving intentional newlines
           overflowWrap: 'break-word',  // ADDED: Allow long words to break and wrap
           // wordBreak: 'break-word' // Could also add this if the above isn't enough
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