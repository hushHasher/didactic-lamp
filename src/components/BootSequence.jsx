import React, { useState, useEffect } from 'react';
import './BootSequence.css';

const bootMessages = [
  "AMIBIOS (C)1992 American Megatrends Inc., Weyland-Yutani Custom ROM",
  "BIOS Date: 04/30/93 Revision 2.1WX",
  "CPU : Intel 486DX/2-66MHz (AuthenticIntel)",
  "Co-Processor : Integrated",
  "Auxiliary Processor: Weyland K5 Neuro-Interface Chip v2.7",
  "Press DEL to run Setup, Press F8 for BBS POPUP, Press F12 for Weyland Diagnostics",
  "",
  "Initializing System...",
  "NVRAM Checksum ... OK",
  "System Memory : 65536KB Extended, 1024KB Base",
  "Memory Bank 00/01 : 16384KB OK",
  "Memory Bank 02/03 : 16384KB OK",
  "Memory Bank 04/05 : 16384KB OK",
  "Memory Bank 06/07 : 16384KB OK",
  "AI Core Synchronization Test ... Passed (Sub-Harmonic Resonance within tolerance)",
  "",
  "Detecting IDE Devices ...",
  "  Primary Master  : WDC AC2200F - 212MB (System Partition)",
  "  Primary Slave   : None",
  "  Secondary Master: Weyland SecureVault - 5TB (AES-2077 Encrypted)",
  "  Secondary Slave : Weyland Bio-Data Archive (Model BD-400)",
  "",
  "Detecting Floppy Drives ...",
  "  Floppy Drive A: 1.44MB, 3.5in",
  "  Floppy Drive B: None",
  "",
  "Initializing Plug and Play Cards ...",
  "PnP BIOS Extension v1.0A (Weyland Enhanced)",
  "  Resource Scan ... Done",
  "  Device Configuration ...",
  "    System Timer               IRQ0",
  "    Keyboard Controller        IRQ1",
  "    Cascade PIC                IRQ2",
  "    COM2 Port                  IRQ3  (02F8h)",
  "    COM1 Port                  IRQ4  (03F8h)",
  "    LPT2 Port                  IRQ5  (Unassigned)",
  "    Floppy Disk Controller     IRQ6  (03F0h)",
  "    LPT1 Port                  IRQ7  (0378h)",
  "    Real Time Clock            IRQ8",
  "    Network Adapter (CorpNet)  IRQ10 (E000h)",
  "    VGA Adapter                IRQ11 (A000h)",
  "    PS/2 Mouse Port            IRQ12",
  "    Math Co-Processor          IRQ13",
  "    Primary IDE Controller     IRQ14",
  "    Secondary IDE Controller   IRQ15",
  "    Weyland K5 Neuro-Link      IRQ5  (D800h) (Conflict Resolved)",
  "",
  "Weyland Corpnet II Adapter ... MAC: 00-WY-C0-RP-N3-T7",
  "  Self Test ... OK",
  "  Initializing Transceiver ... OK",
  "  Acquiring Network Address ... 10.20.77.101",
  "",
  "Connecting to Colonial Administration Network...",
  "  Gateway: 10.20.0.1",
  "  DNS Server: 10.20.0.53",
  "  Authenticating with MU-TH-UR 6000 Central Core...",
  "  Authentication Key Exchange ... Success",
  "  MU-TH-UR 6000 Interface Link ... Established (Session ID: WY-486DX-930430-A7B3)",
  "  Colonial Security Policy v7.2.1 Loaded.",
  "",
  "Initializing Onboard Systems:",
  "  Environmental Controls ... Nominal",
  "  Life Support Link (Local) ... Active",
  "  BioScanner Subsystem Initialized. Firmware v3.1. Status: Nominal.",
  "  Cryo-Storage Monitoring Link ... Disconnected (No active units)",
  "  Automated Sentry System ... Standby",
  "",
  "Booting from Hard Disk C: (WEYLAND_OS)",
  "Starting MS-DOS 6.22 (Weyland Enhanced Environment)...",
  "",
  "HIMEM is testing extended memory...done.",
  "EMM386 Memory Manager Active.",
  "SMARTDRV Disk Cache Utility v5.0",
  "Microsoft Mouse Driver Version 8.20",
  "  Mouse driver installed.",
  "Weyland Corp. Security Agent v2.5 ... Loaded.",
  "  Intrusion Detection System ... Active.",
  "  Data Exfiltration Monitor ... Active.",
  "",
  "WEYLAND CMD v1.3, Build 2080",
  "Property of Weyland-Yutani Corp. Unauthorized Access Prohibited.",
  "All activities on this terminal are logged.",
  "Type 'HELP' for a list of commands. Type 'LOGIN' to authenticate.",
  "LOADING USER INTERFACE...",
  ""
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
      const lineDelay = bootMessages[messageIndex] === "" ? 100 : Math.random() * 75 + 25;
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
      }, 500); // Wait a bit less after last message
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