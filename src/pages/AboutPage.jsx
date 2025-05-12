// src/pages/AboutPage.jsx
import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Import the hook

function AboutPage() {
  const pageKey = 'visits_about'; // Unique key

  // Define the full text for the paragraphs
  const accessText = "> ACCESSING ARCHIVAL DATA ON SYSTEM PRIME OPERATOR...";
  const decryptText = "> DECRYPTION LEVEL: SUFFICIENT";
  const para1Text = "The primary architect and operator of this node is an entity driven by an enduring fascination with the digital frontier. A veteran of silicon pathways and evolving code paradigms, their journey commenced in an era of phosphor glows and dial-up handshakes.";
  const para2Text = "Decades spent navigating the currents of technological advancement – from the nascent hum of early mainframes to the complex symphonies of modern networks – have forged a unique perspective. This is not merely an occupation, but an ingrained methodology: to deconstruct, to innovate, to build.";
  const para3Text = "This interface, WEYLAND CORP TERMINAL v3.9.96, serves as a curated repository of their endeavors, a testament to persistent creation, and a gateway to ongoing projects. It stands as a digital workshop, a personal archive, and a point of connection.";
  const para4Text = "The core directive remains consistent: Explore. Create. Evolve.";
  const endText = "> END OF FILE. C:\\SYSTEM\\LOGS> _";

  // Pass pageKey (can use suffixes or just one key per page if order doesn't matter)
  const typedAccess = useTypewriter(accessText, 30, `${pageKey}_access`);
  const typedDecrypt = useTypewriter(decryptText, 30, `${pageKey}_decrypt`);
  const typedPara1 = useTypewriter(para1Text, 20, `${pageKey}_p1`);
  const typedPara2 = useTypewriter(para2Text, 25, `${pageKey}_p2`);
  const typedPara3 = useTypewriter(para3Text, 20, `${pageKey}_p3`);
  const typedPara4 = useTypewriter(para4Text, 40, `${pageKey}_p4`);
  const typedEnd = useTypewriter(endText, 30, `${pageKey}_end`);


  return (
    <section id="about" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\SYSTEM\LOGS\OPERATOR_PROFILE.TXT</h2>
       <div className="tui-panel">
         <p>{typedAccess}{typedAccess !== accessText ? '_' : ''}</p>
         <p>{typedDecrypt}{typedDecrypt !== decryptText ? '_' : ''}</p>
         <p>----------------------------------------------------------------------</p>
         <p>{typedPara1}{typedPara1 !== para1Text ? '_' : ''}</p>
         <p>{typedPara2}{typedPara2 !== para2Text ? '_' : ''}</p>
         <p>{typedPara3}{typedPara3 !== para3Text ? '_' : ''}</p>
         <p>{typedPara4}{typedPara4 !== para4Text ? '_' : ''}</p>
         <p>----------------------------------------------------------------------</p>
         <p>{typedEnd}{typedEnd !== endText ? '_' : ''}</p>
       </div>
    </section>
  );
}

export default AboutPage;