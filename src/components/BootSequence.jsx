import React, { useState, useEffect } from 'react';
import './BootSequence.css';

const bootMessages = [
  "WEYLAND-YUTANI CORP BIOS v3.02",
  "Copyright (C) 1996 Weyland-Yutani Corporation",
  "Main Processor: Intel 80386DX @ 33MHz",
  "Memory Test: 640K OK",
  "",
  "Initializing USB Controllers ... Done",
  "Initializing Network Card ... MAC ADDR: 00:1A:2B:3C:4D:5E",
  "Checking NVRAM...",
  "",
  "Booting from C:",
  "Starting MS-DOS...",
  "",
  "HIMEM is testing extended memory...done.",
  "SMARTDRV: Double Buffering enabled.",
  "Microsoft Mouse Driver Version 8.20",
  "Copyright (C) Microsoft Corp. 1983-1992.",
  "Mouse driver installed.",
  "",
  "WEYLAND CMD v1.0, Build 2077",
  "Enhanced by Yutani Corp AI Division",
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