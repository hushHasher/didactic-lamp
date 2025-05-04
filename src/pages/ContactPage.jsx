// src/pages/ContactPage.jsx - Corrected HTML Structure
import React from 'react';

function ContactPage() {
  // Replace with your actual details
  const email = "robim.developer@email.com"; // Replace
  const linkedInUrl = "https://linkedin.com/in/robim-profile"; // Replace
  const githubUrl = "https://github.com/robim-github"; // Replace

  return (
    <section id="contact" className="tui-window" style={{ marginTop: '20px' }}>
       <h2 className="tui-title">C:\CONTACT</h2>
       <div className="tui-panel">
         <p>You can reach me via the following channels:</p>
         {/* REMOVED the surrounding <p> tag */}
         <dl> {/* <dl> is now a direct child of the div */}
           <dt>EMAIL</dt>
           <dd><a href={`mailto:${email}`}>{email}</a></dd>
           <dt>LINKEDIN</dt>
           <dd><a href={linkedInUrl} target="_blank" rel="noopener noreferrer">{linkedInUrl}</a></dd>
           <dt>GITHUB</dt>
           <dd><a href={githubUrl} target="_blank" rel="noopener noreferrer">{githubUrl}</a></dd>
         </dl>
       </div>
    </section>
  );
}

export default ContactPage;