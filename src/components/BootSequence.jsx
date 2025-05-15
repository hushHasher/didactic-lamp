import React, { useState, useEffect } from 'react';
import './BootSequence.css';

const bootMessages = [
  "AMIBIOS (C)1992 American Megatrends Inc.",
  "BIOS Date: 04/30/93",
  "CPU : Intel 486DX/2-66MHz",
  "Auxiliary Processor: Weyland K5 Neuro-Interface Chip",
  "Press DEL to run Setup, Press F8 for BBS POPUP",
  "",
  "Checking NVRAM..OK",
  "Memory Test : 16384K OK",
  "AI Core Synchronization Test ... Passed",
  "",
  "Fixed Disk 0: WDC AC2200F - 212MB (System)",
  "Fixed Disk 1: Weyland SecureVault - 5TB (Encrypted)",
  "Floppy Drive A: 1.44MB, 3.5in",
  "Floppy Drive B: None",
  "",
  "Initializing Plug and Play Cards ...",
  "PnP BIOS Extension v1.0A",
  "  ISA PnP LPT Port at 0378h ... OK",
  "  ISA PnP COM Port at 02F8h ... OK",
  "  WEYLAND Corpnet II Adapter ... MAC: 00-WY-C0-RP-N3-T7 ... OK",
  "",
  "Connecting to Colonial Administration Network...",
  "Signal Strength: Strong. Encryption: AES-2077 Standard.",
  "MU-TH-UR 6000 Interface Link ... Established.",
  "",
  "Booting from Hard Disk C:",
  "Starting MS-DOS 6.22 (Weyland Enhanced Environment)...",
  "",
  "HIMEM is testing extended memory...done.",
  "BioScanner Subsystem Initialized. Status: Nominal.",
  "Microsoft Mouse Driver Version 8.20",
  "Copyright (C) Microsoft Corp. 1983-1992.",
  "Mouse driver installed.",
  "",
  "WEYLAND CMD v1.2, Build 2079",
  "Property of Weyland-Yutani Corp. Unauthorized Access Prohibited.",
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