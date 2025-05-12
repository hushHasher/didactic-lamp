// src/DosTerminal.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

// --- Define the Fake File System ---
const fileSystem = {
  'C:': {
    'SYSTEM': {
      type: 'directory',
      children: {
        'CONFIG.SYS': { type: 'file', content: 'DEVICE=C:\\SYSTEM\\DRIVERS\\BIOS.SYS\nBUFFERS=20\nFILES=40' },
        'AUTOEXEC.BAT': { type: 'file', content: '@ECHO OFF\nPROMPT $P$G\nPATH C:\\SYSTEM;C:\\UTILS\nECHO Weyland Corp OS Initialized.' },
        'DRIVERS': {
          type: 'directory',
          children: {
            'BIOS.SYS': { type: 'file', content: 'BIOS Version 8.01. WC Internal.' },
            'NETWORK.SYS': { type: 'file', content: 'Network Interface Driver. Status: Connected.' }
          }
        }
      }
    },
    'PROJECTS': {
      type: 'directory',
      children: {
        'OVERLORD.TXT': { type: 'file', content: 'Project Overlord: Status - ACTIVE. Objective: AI Sentience.\nContact: Dr. Aris Thorne.'},
        'CHIMERA.DAT': { type: 'file', content: 'CLASSIFIED DATA - ACCESS RESTRICTED'}
      }
    },
    'WELCOME.TXT': { type: 'file', content: 'Welcome to the Weyland Corp Mainframe.\nUse DIR to list files, CD to change directory, TYPE to view files.'},
    'README.MD': { type: 'file', content: 'SYSTEM NOTICE: Unauthorized access is monitored and prosecuted.'}
  }
};

// Helper function to navigate the file system object
function getFileSystemEntry(path, fs) {
  const parts = path.toUpperCase().split('\\').filter(p => p); // C:, SYSTEM, DRIVERS
  if (parts.length === 0 || parts[0] !== 'C:') return null; // Must start with C:

  let currentLevel = fs[parts[0]];
  if (!currentLevel) return null;

  for (let i = 1; i < parts.length; i++) {
    if (currentLevel && currentLevel.type === 'directory' && currentLevel.children && currentLevel.children[parts[i].toUpperCase()]) {
      currentLevel = currentLevel.children[parts[i].toUpperCase()];
    } else {
      return null; // Path not found or not a directory
    }
  }
  return currentLevel;
}

function DosTerminal(props) {
  const divRef = useRef(null);
  const termInstanceRef = useRef(null);
  const fitAddonInstanceRef = useRef(null);
  const keyListenerRef = useRef(null);
  const navigate = useNavigate();
  const terminalWindowRef = useRef(null);

  // State for window position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const [hasBeenDragged, setHasBeenDragged] = useState(false);

  useEffect(() => {
    // Set initial position based on the CSS-defined position of terminal-container
    if (terminalWindowRef.current && !hasBeenDragged) {
      const rect = terminalWindowRef.current.parentElement.getBoundingClientRect();
    }
  }, [hasBeenDragged]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasBeenDragged(true);

    const terminalRect = terminalWindowRef.current.getBoundingClientRect();

    setDragStartOffset({
      x: e.clientX - terminalRect.left,
      y: e.clientY - terminalRect.top,
    });

    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    let newX = e.clientX - dragStartOffset.x;
    let newY = e.clientY - dragStartOffset.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    console.log("DosTerminal useEffect running.");

    let term;

    if (divRef.current && !termInstanceRef.current) {
      console.log("DosTerminal: Initializing Terminal.");

      if (!fitAddonInstanceRef.current) {
          fitAddonInstanceRef.current = new FitAddon();
      }
      const fitAddon = fitAddonInstanceRef.current;

      term = new Terminal({
        cursorBlink: true,
        cursorStyle: 'block',
        fontFamily: 'monospace',
        theme: {
          background: '#0000AA',
          foreground: '#FFFFFF',
          cursor: '#FFFFFF',
          cursorAccent: '#0000AA'
        }
      });
      termInstanceRef.current = term;

      try {
        term.open(divRef.current);

        term.loadAddon(fitAddon);

        setTimeout(() => {
            try {
                console.log("DosTerminal: Fitting addon...");
                fitAddon.fit();
                console.log(`DosTerminal: Fit complete. Size: ${term.cols}x${term.rows}`);

                let currentCommand = '';
                let currentPath = 'C:\\';

                term.writeln("WEYLAND CORP (c) More human than human");
                term.writeln("[Version 443.0.4.293]");
                term.writeln("");
                term.writeln("Type 'help' for a list of available commands.");
                term.write(`${currentPath.toUpperCase()}> `);

                const updatePrompt = () => {
                  term.write(`\r\n${currentPath.toUpperCase()}> `);
                };

                keyListenerRef.current?.dispose();

                keyListenerRef.current = term.onKey(e => {
                  const { key, domEvent } = e;
                  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

                  if (domEvent.key === 'Enter') {
                     term.writeln('');
                     const [command, ...args] = currentCommand.trim().split(/\s+/);
                     const processedCommand = command.toLowerCase();
                     if (processedCommand === 'help') {
                       term.writeln('Available commands:');
                       term.writeln('  help          - Displays this help message.');
                       term.writeln('  about         - Navigates to the About section.');
                       term.writeln('  projects      - Navigates to the Projects section.');
                       term.writeln('  dir           - Lists files and directories.');
                       term.writeln('  cd <dir>      - Changes current directory. Use "cd .." to go up.');
                       term.writeln('  type <file>   - Displays the content of a file.');
                       term.writeln('  clear         - Clears the terminal screen.');
                       term.writeln('  exit          - Closes the terminal interface.');
                     } else if (processedCommand === 'clear') {
                       term.clear();
                     } else if (processedCommand === 'exit') {
                       term.writeln('Closing terminal interface...');
                       props.onClose?.();
                     } else if (processedCommand === 'about') {
                       term.writeln('Navigating to C:\\ABOUT...');
                       navigate('/about');
                     } else if (processedCommand === 'projects') {
                       term.writeln('Navigating to C:\\PROJECTS...');
                       navigate('/projects');
                     } else if (processedCommand === 'dir') {
                        const entry = getFileSystemEntry(currentPath, fileSystem);
                        if (entry && entry.type === 'directory') {
                            term.writeln(` Directory of ${currentPath.toUpperCase()}`);
                            term.writeln('');
                            let fileCount = 0;
                            let dirCount = 0;
                            if (currentPath.toUpperCase() !== 'C:\\') {
                                term.writeln(`  <DIR>         .`);
                                term.writeln(`  <DIR>         ..`);
                                dirCount +=2;
                            }

                            Object.entries(entry.children).forEach(([name, item]) => {
                                if (item.type === 'directory') {
                                    term.writeln(`  <DIR>         ${name}`);
                                    dirCount++;
                                } else {
                                    term.writeln(`                ${name}`);
                                    fileCount++;
                                }
                            });
                            term.writeln(`\r\n       ${fileCount} File(s)`);
                            term.writeln(`       ${dirCount} Dir(s)`);
                        } else {
                            term.writeln('Invalid path.');
                        }
                     } else if (processedCommand === 'cd') {
                        const targetDirRaw = args.join(' ').trim();
                        const targetDir = targetDirRaw.toUpperCase();

                        if (!targetDirRaw) {
                            term.writeln(currentPath.toUpperCase());
                        } else if (targetDir === '..') {
                            const parts = currentPath.toUpperCase().split('\\').filter(p => p && p !== 'C:');
                            if (parts.length > 0) {
                                parts.pop();
                                currentPath = 'C:\\' + parts.join('\\') + (parts.length > 0 ? '\\' : '');
                            } else {
                                currentPath = 'C:\\';
                            }
                        } else {
                            let newPath;
                            if (targetDir.startsWith('C:\\')) {
                                newPath = targetDir;
                            } else {
                                newPath = (currentPath.endsWith('\\') ? currentPath : currentPath + '\\') + targetDir;
                            }
                            if (!newPath.endsWith('\\') && newPath.toUpperCase() !== 'C:') {
                                newPath += '\\';
                            } else if (newPath.toUpperCase() === 'C:') {
                                newPath = 'C:\\';
                            }

                            const entry = getFileSystemEntry(newPath, fileSystem);
                            if (entry && entry.type === 'directory') {
                                currentPath = newPath.toUpperCase();
                            } else {
                                term.writeln('Directory not found or invalid path.');
                            }
                        }
                     } else if (processedCommand === 'type') {
                        const fileName = args.join(' ').trim().toUpperCase();
                        if (!fileName) {
                            term.writeln('Usage: TYPE <filename>');
                        } else {
                            const currentDirEntry = getFileSystemEntry(currentPath, fileSystem);
                            if (currentDirEntry && currentDirEntry.type === 'directory' && currentDirEntry.children[fileName]) {
                                const fileEntry = currentDirEntry.children[fileName];
                                if (fileEntry.type === 'file') {
                                    const lines = fileEntry.content.split('\n');
                                    lines.forEach(line => term.writeln(line));
                                } else {
                                    term.writeln(`Cannot TYPE a directory: ${fileName}`);
                                }
                            } else {
                                term.writeln(`File not found: ${fileName}`);
                            }
                        }
                     } else if (processedCommand !== '') {
                       term.writeln(`Bad command or file name: ${processedCommand}`);
                     }
                     currentCommand = '';
                     updatePrompt();
                  } else if (domEvent.key === 'Backspace') {
                     if (currentPath && currentCommand.length > 0 && term.buffer.normal.cursorX > currentPath.length + 2) {
                       domEvent.preventDefault();
                       term.write('\b \b');
                       currentCommand = currentCommand.slice(0, -1);
                     } else {
                       domEvent.preventDefault();
                     }
                  } else if (printable && key.length === 1) {
                     currentCommand += key;
                     term.write(key);
                  }
                });

            } catch (fitError) {
                console.error("Error during fit/write:", fitError);
            }
        }, 0);

      } catch (initError) {
        console.error("Error during direct xterm initialization:", initError);
        termInstanceRef.current = null;
      }
    }

    return () => {
      console.log("DosTerminal cleanup: Disposing terminal and listener.");
      keyListenerRef.current?.dispose();
      keyListenerRef.current = null;
      if (termInstanceRef.current) {
          termInstanceRef.current.dispose();
          termInstanceRef.current = null;
          console.log("Terminal instance disposed.");
      } else {
          console.log("No terminal instance found in ref to dispose.");
      }
    };

  }, [navigate, props.onClose]);

  return (
    <div
      ref={terminalWindowRef}
      className="dos-terminal-window"
      style={hasBeenDragged ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
      } : {
      }}
    >
      <div
        className="dos-terminal-title-bar"
        onMouseDown={handleMouseDown}
      >
        <span>C:\WINDOWS\SYSTEM32\COMMAND.COM</span>
        <button className="dos-terminal-close-btn" onClick={props.onClose} aria-label="Close terminal">
          X
        </button>
      </div>
      <div ref={divRef} className="dos-terminal-content" style={{ height: 'calc(100% - 25px)', width: '100%' }} />
    </div>
  );
}

export default DosTerminal;