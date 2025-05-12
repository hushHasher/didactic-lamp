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
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [windowState, setWindowState] = useState('normal'); // 'normal', 'minimized', 'maximized'
  const [normalSizeBeforeMaximize, setNormalSizeBeforeMaximize] = useState({ width: 0, height: 0 });
  const [normalPositionBeforeMaximize, setNormalPositionBeforeMaximize] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (terminalWindowRef.current && terminalWindowRef.current.parentElement && !hasBeenDragged && windowState === 'normal') {
      const parentRect = terminalWindowRef.current.parentElement.getBoundingClientRect();
      const newSize = { width: parentRect.width, height: parentRect.height };
      setInitialSize(newSize);
      setNormalSizeBeforeMaximize(newSize); // Also set for potential maximize
      
      const newPosition = { x: parentRect.left, y: parentRect.top };
      setPosition(newPosition);
      setNormalPositionBeforeMaximize(newPosition); // Also set for potential maximize
    }
  // Ensure dependencies are correct, windowState might be needed if logic changes based on it
  }, [hasBeenDragged, windowState]); 

  const handleMouseDown = (e) => {
    if (e.button !== 0 || windowState === 'maximized') return; // Don't drag if maximized
    setIsDragging(true);
    
    if (!hasBeenDragged) {
      const parentElement = terminalWindowRef.current.parentElement;
      if (parentElement) {
        const parentRect = parentElement.getBoundingClientRect();
        const currentSize = { width: parentRect.width, height: parentRect.height };
        setInitialSize(currentSize);
        // Only update normalSize if not already set by maximize logic
        if (windowState !== 'maximized') setNormalSizeBeforeMaximize(currentSize);
        
        const currentRect = terminalWindowRef.current.getBoundingClientRect();
        const currentPos = { x: currentRect.left, y: currentRect.top };
        setPosition(currentPos);
        if (windowState !== 'maximized') setNormalPositionBeforeMaximize(currentPos);
      }
    }
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

  const handleCloseButtonClick = (e) => {
    e.stopPropagation(); 
    props.onClose?.();
    // Optionally reset state if terminal can be reopened later
    setWindowState('normal'); 
    setHasBeenDragged(false);
  };

  const handleMinimizeButtonClick = (e) => {
    e.stopPropagation();
    if (windowState === 'minimized') {
      setWindowState('normal');
      // Ensure xterm fits when restoring from minimized
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 0);
    } else {
      setWindowState('minimized');
    }
  };

  const handleMaximizeButtonClick = (e) => {
    e.stopPropagation();
    if (windowState === 'maximized') {
      setWindowState('normal');
      setPosition(normalPositionBeforeMaximize);
      setInitialSize(normalSizeBeforeMaximize); // This will be used by the style block
       // Ensure xterm fits when restoring
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 0);
    } else {
      // Store current size and position before maximizing
      const currentRect = terminalWindowRef.current.getBoundingClientRect();
      setNormalPositionBeforeMaximize({ x: currentRect.left, y: currentRect.top });
      // Use initialSize if not dragged yet, or currentRect.width/height if it has been
      setNormalSizeBeforeMaximize({ 
        width: hasBeenDragged ? currentRect.width : initialSize.width, 
        height: hasBeenDragged ? currentRect.height : initialSize.height 
      });
      
      setWindowState('maximized');
      // Position will be set by style block for maximized state
       // Ensure xterm fits when maximizing
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 0);
    }
  };

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

  // --- Determine window style based on state ---
  let windowStyle = {};
  if (hasBeenDragged && windowState === 'normal') {
    windowStyle = {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${initialSize.width}px`,
      height: `${initialSize.height}px`,
    };
  } else if (windowState === 'maximized') {
    windowStyle = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh', // Or calc(100vh - taskbarHeight) if you want to be fancy
    };
  } else if (windowState === 'minimized') {
    // When minimized, it will also be 'fixed' positioned if it was dragged before.
    // If not dragged, it should stay where .terminal-container put it.
    // We'll apply fixed positioning to ensure it can be placed at bottom or wherever.
    // For simplicity, let's just shrink it and keep its last 'normal' or initial position.
    windowStyle = {
      position: 'fixed', // Or inherit if not hasBeenDragged and you want it relative to .terminal-container
      left: hasBeenDragged ? `${position.x}px` : (terminalWindowRef.current?.parentElement?.getBoundingClientRect().left || 0) + 'px',
      top: hasBeenDragged ? `${position.y}px` : (terminalWindowRef.current?.parentElement?.getBoundingClientRect().top || 0) + 'px',
      width: `${initialSize.width * 0.5}px`, // Example: half width
      height: '25px', // Just the title bar height
      overflow: 'hidden', // Hide content
    };
    // If not dragged, and we want to place it at the bottom right corner when minimized:
    if (!hasBeenDragged) {
        windowStyle.left = 'auto'; // unset left
        windowStyle.right = '20px'; // From .terminal-container
        windowStyle.top = 'auto';   // unset top
        windowStyle.bottom = '20px'; // From .terminal-container
        windowStyle.width = '200px'; // A fixed minimized width
    }
  }
  // If !hasBeenDragged and windowState === 'normal', it uses CSS from .terminal-container parent.

  return (
    <div
      ref={terminalWindowRef}
      className="dos-terminal-window"
      style={windowStyle}
    >
      <div
        className="dos-terminal-title-bar"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximizeButtonClick} // Double click to maximize/restore
      >
        <span>C:\WINDOWS\SYSTEM32\COMMAND.COM</span>
        <div className="dos-terminal-window-controls">
          <button 
            className="dos-terminal-control-btn" 
            aria-label="Minimize"
            onClick={handleMinimizeButtonClick}
          >
            _
          </button>
          <button 
            className="dos-terminal-control-btn" 
            aria-label={windowState === 'maximized' ? "Restore" : "Maximize"}
            onClick={handleMaximizeButtonClick}
          >
            {windowState === 'maximized' ? '❐' : '□'} {/* Maximize/Restore icons */}
          </button>
          <button 
            className="dos-terminal-control-btn dos-terminal-close-btn"
            onClick={handleCloseButtonClick}
            aria-label="Close terminal"
          >
            X
          </button>
        </div>
      </div>
      {windowState !== 'minimized' && ( // Conditionally render content
        <div ref={divRef} className="dos-terminal-content" style={{ height: 'calc(100% - 25px)', width: '100%' }} />
      )}
    </div>
  );
}

export default DosTerminal;