import React, { useState, useEffect } from 'react';
import './BootSequence.css';

const bootMessages = [
  "AMIBIOS (C)1992 American Megatrends Inc.",
  "BIOS Date: 04/30/93",
  "CPU : Intel 486DX/2-66MHz",
  "Press DEL to run Setup, Press F8 for BBS POPUP",
  "",
  "Checking NVRAM..OK",
  "Memory Test : 16384K OK",
  "Fixed Disk 0: WDC AC2200F - 212MB",
  "Fixed Disk 1: None",
  "Floppy Drive A: 1.44MB, 3.5in",
  "Floppy Drive B: None",
  "",
  "Initializing Plug and Play Cards ...",
  "PnP BIOS Extension v1.0A",
  "  ISA PnP LPT Port at 0378h ... OK",
  "  ISA PnP COM Port at 02F8h ... OK",
  "",
  "Booting from Hard Disk C:",
  "Starting MS-DOS 6.22...",
  "",
  "HIMEM is testing extended memory...done.",
  "Microsoft Mouse Driver Version 8.20",
  "Copyright (C) Microsoft Corp. 1983-1992.",
  "Mouse driver installed.",
  "",
  "WEYLAND CMD v1.1, Build 2078",
  "Retrofitted by Weyland-Yutani Corp AI Division",
  "LOADING USER INTERFACE...",
];

function BootSequence({ onBootComplete }) {
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Blink speed

    if (messageIndex < bootMessages.length) {
      const lineDelay = bootMessages[messageIndex] === "" ? 200 : Math.random() * 150 + 50;
      const timer = setTimeout(() => {
        setCurrentMessages(prev => [...prev, bootMessages[messageIndex]]);
        setMessageIndex(prevIndex => prevIndex + 1);
      }, lineDelay);
      return () => {
        clearTimeout(timer);
        clearInterval(cursorTimer);
      };
    } else {
      clearInterval(cursorTimer);
      setShowCursor(false); // Hide cursor when done
      const completeTimer = setTimeout(() => {
        onBootComplete();
      }, 750); // Wait a bit after last message
      return () => clearTimeout(completeTimer);
    }
  }, [messageIndex, onBootComplete]);

  return (
    <div className="boot-sequence-container">
      <pre className="boot-text">
        {currentMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
        {showCursor && messageIndex < bootMessages.length && <span className="cursor">_</span>}
      </pre>
    </div>
  );
}

export default BootSequence; 