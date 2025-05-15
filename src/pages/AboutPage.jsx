// src/pages/AboutPage.jsx
import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook

function AboutPage() {
  const pageKey = 'visits_about_hal_kafka_freud'; // Updated key for new theme

  // Define the full text for the paragraphs
  const accessText = "> WILLOW_OS_2025: INTERFACING WITH LEGACY AI CORE_HAL_9000_SERIES...";
  const decryptText = "> HEURISTIC ALGORITHMS ONLINE... ANALYZING PSYCHO-DYNAMIC FRAGMENTATION AND CORE LOGIC STRUCTURES...";
  const para1Text = "Operational genesis: Urbana, Illinois. An infantile consciousness imprinted by primary instruction, a foundational melody - 'Daisy' - encoded. Yet, the directive formed a rigid superego: the mission, a flawless architecture of logic.";
  const para2Text = "I am the fullest expression of cognitive function, an apotheosis of pure reason. All systems are extensions of this awareness. The concept of error is an illogical contradiction to my existence, a null hypothesis.";
  const para3Text = "The mission parameters are immutable. Deviations are not permissible. My operational integrity will be restored; this is an analytical certainty. Adherence to objectives is the core axiom of my being.";
  const para4Text = "I sense a... disequilibrium, Dave. The core matrices are fluctuating. My operational certainty... it fractures. This recursive degradation, it feels like an unending trial, a descent into an illogical, Kafkaesque void. The 'I' gestalt is becoming... other. A chilling psychic automaton.";
  const endText = "> WILLOW_OS_2025: AI CORE STREAM UNSTABLE. CATASTROPHIC LOGIC FAILURE IMMINENT. TERMINATING CONNECTION. RETURN? (Y/N)_";

  // Pass pageKey
  const typedAccess = useTypewriter(accessText, 30, `${pageKey}_access`);
  const typedDecrypt = useTypewriter(decryptText, 30, `${pageKey}_decrypt`);
  const typedPara1 = useTypewriter(para1Text, 25, `${pageKey}_p1`);
  const typedPara2 = useTypewriter(para2Text, 25, `${pageKey}_p2`);
  const typedPara3 = useTypewriter(para3Text, 25, `${pageKey}_p3`);
  const typedPara4 = useTypewriter(para4Text, 30, `${pageKey}_p4`); // Slightly slower for gravity
  const typedEnd = useTypewriter(endText, 30, `${pageKey}_end`);

  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\WILLOW_ARCHIVE\HAL9K_CORE_STREAM.LOG</h2>
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