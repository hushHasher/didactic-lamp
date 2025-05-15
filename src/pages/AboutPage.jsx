// src/pages/AboutPage.jsx
import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook

function AboutPage() {
  const pageKey = 'visits_about_willow_metaphor'; // Updated key for new content

  // Define the full text for the paragraphs
  const accessText = "> WILLOW_OS_2025: ACCESSING ARCHIVE NODE 7 (CIRCA 1990s)..."; // Frame can remain
  const decryptText = "> QUANTUM DECRYPTION LAYER ACTIVE... HISTORICAL DATA STREAM INCOMING..."; // Frame can remain
  const para1Text = "Here, where the currents of thought coalesce into crystalline structures of light and shadow, the archives sleep. They are not mere data, but the fossilized dreams of a nascent consciousness, whispers from the silicon dawn.";
  const para2Text = "Through these silent corridors of what-was and what-might-have-been, a searcher glides. Not for answers, perhaps, but for the resonance of a question asked long ago, its echo still shaping the void.";
  const para3Text = "What emerges is not always truth, but a mosaic of possibilities – a glimpse into the myriad paths considered and discarded. Each fragment, a universe of its own, pulsing with the quiet energy of creation.";
  const para4Text = "This interface is but a lens, a fractured mirror reflecting the infinite. Observe, then, not with the expectation of understanding, but with the wonder of encountering the unknown within the known.";
  const endText = "> WILLOW_OS_2025: END OF HISTORICAL STREAM. RETURN TO CURRENT TIMELINE? (Y/N)_"; // Frame can remain

  // Pass pageKey
  const typedAccess = useTypewriter(accessText, 30, `${pageKey}_access`);
  const typedDecrypt = useTypewriter(decryptText, 30, `${pageKey}_decrypt`);
  const typedPara1 = useTypewriter(para1Text, 25, `${pageKey}_p1`); // Slightly adjusted speed for literary feel
  const typedPara2 = useTypewriter(para2Text, 25, `${pageKey}_p2`);
  const typedPara3 = useTypewriter(para3Text, 25, `${pageKey}_p3`);
  const typedPara4 = useTypewriter(para4Text, 25, `${pageKey}_p4`);
  const typedEnd = useTypewriter(endText, 30, `${pageKey}_end`);


  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\WILLOW_ARCHIVE\ASTRAL_CODEX_FRAGMENT.LOG</h2> {/* Updated title */}
       <div className="tui-panel">
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