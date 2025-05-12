import React, { useState, useEffect } from 'react';

function FooterClock() {
  // State and effect for the current time are now isolated here
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []); // Runs once on mount

  return (
    <footer className="tui-panel" style={{textAlign: 'center', padding: '10px', marginTop: 'auto', flexShrink: 0 }}>
      (C) 1986 - {new Date().getFullYear()} Weyland Corp. Current time: {currentTime}
    </footer>
  );
}

export default FooterClock; 