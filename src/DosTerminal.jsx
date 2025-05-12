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
  const [windowState, setWindowState] = useState('normal'); // 'normal', 'maximized' (minimized is now like close)
  const [normalSizeBeforeMaximize, setNormalSizeBeforeMaximize] = useState({ width: 0, height: 0 });
  const [normalPositionBeforeMaximize, setNormalPositionBeforeMaximize] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // This effect primarily sets up the initial size and position for 'normal' state
    // and for restoration from 'maximized' state.
    if (terminalWindowRef.current && terminalWindowRef.current.parentElement && !hasBeenDragged && windowState === 'normal') {
      const parentRect = terminalWindowRef.current.parentElement.getBoundingClientRect();
      const newSize = { width: parentRect.width, height: parentRect.height };
      
      // Only set these if they haven't been set by a previous maximize action or drag
      if (initialSize.width === 0 || initialSize.height === 0) {
        setInitialSize(newSize);
      }
      if (normalSizeBeforeMaximize.width === 0 || normalSizeBeforeMaximize.height === 0) {
        setNormalSizeBeforeMaximize(newSize);
      }
      
      const newPosition = { x: parentRect.left, y: parentRect.top };
      if (position.x === 0 && position.y === 0) { // Avoid resetting if already positioned by drag
          setPosition(newPosition);
      }
      if (normalPositionBeforeMaximize.x === 0 && normalPositionBeforeMaximize.y === 0) {
        setNormalPositionBeforeMaximize(newPosition);
      }
    }
  }, [hasBeenDragged, windowState, initialSize, normalSizeBeforeMaximize, position, normalPositionBeforeMaximize]);

  const handleMouseDown = (e) => {
    if (e.button !== 0 || windowState === 'maximized') return; 
    setIsDragging(true);
    
    if (!hasBeenDragged) {
      const parentElement = terminalWindowRef.current.parentElement;
      const currentWindowRect = terminalWindowRef.current.getBoundingClientRect();
      let referenceSize;
      let referencePos;

      if (parentElement) {
          const parentRect = parentElement.getBoundingClientRect();
          referenceSize = { width: parentRect.width, height: parentRect.height };
          referencePos = { x: parentRect.left, y: parentRect.top };
      } else { // Fallback if no parent (shouldn't happen with current setup)
          referenceSize = { width: currentWindowRect.width, height: currentWindowRect.height };
          referencePos = { x: currentWindowRect.left, y: currentWindowRect.top };
      }
      
      setInitialSize(referenceSize);
      if (windowState !== 'maximized') { // Store these as the 'normal' dimensions if not coming from maximized
        setNormalSizeBeforeMaximize(referenceSize);
        setNormalPositionBeforeMaximize(referencePos);
      }
      // Ensure current position for drag calculation is accurate
      setPosition({ x: currentWindowRect.left, y: currentWindowRect.top });
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
    setWindowState('normal'); 
    setHasBeenDragged(false);
    // Reset sizes and positions to initial defaults for next open
    setPosition({ x: 0, y: 0 }); 
    setInitialSize({ width: 0, height: 0 });
    setNormalSizeBeforeMaximize({ width: 0, height: 0 });
    setNormalPositionBeforeMaximize({ x: 0, y: 0 });
  };

  // Minimize button now acts like close
  const handleMinimizeButtonClick = (e) => {
    e.stopPropagation();
    handleCloseButtonClick(e); // Call the close handler
  };

  const handleMaximizeButtonClick = (e) => {
    e.stopPropagation();
    const term = termInstanceRef.current; // Get the terminal instance

    if (windowState === 'maximized') {
      setWindowState('normal');
      // Restore to position and size before maximizing
      setPosition(normalPositionBeforeMaximize); 
      // No need to setInitialSize here, as 'normal' dragged state uses 'position' and 'initialSize' from drag start
      // Or if not dragged, it relies on parent .terminal-container
      // We should ensure `initialSize` is the one to restore to for `normal` mode.
      // Let's make sure `normalSizeBeforeMaximize` is used as the target size for 'normal' state.
      setInitialSize(normalSizeBeforeMaximize); // This ensures the 'normal' state uses the correct dimensions

      setTimeout(() => fitAddonInstanceRef.current?.fit(), 50); // Added small delay
    } else {
      // Store current size and position IF it's in 'normal' state and has been potentially dragged
      const currentRect = terminalWindowRef.current.getBoundingClientRect();
      if (windowState === 'normal') {
        setNormalPositionBeforeMaximize({ x: currentRect.left, y: currentRect.top });
        setNormalSizeBeforeMaximize({ width: currentRect.width, height: currentRect.height });
      }
      // If it wasn't dragged and is 'normal', its initial size from parent is already in normalSizeBeforeMaximize
      
      setWindowState('maximized');
      // Position will be set by style block for maximized state
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 50); // Added small delay
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

  if (windowState === 'maximized') {
    windowStyle = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: 1001, // Ensure it's above other elements when maximized
    };
  } else if (windowState === 'normal') {
    if (hasBeenDragged) {
      windowStyle = {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${initialSize.width}px`, 
        height: `${initialSize.height}px`,
      };
    } else {
      // Not dragged, normal state: relies on .terminal-container for initial pos/size
      // .dos-terminal-window has width/height 100% to fill its parent (.terminal-container)
      // No specific style needed here as it will be positioned by its parent.
    }
  }
  // No 'minimized' style block needed as it now closes.

  return (
    <div
      ref={terminalWindowRef}
      className="dos-terminal-window"
      style={windowStyle} // Apply the determined style
    >
      <div
        className="dos-terminal-title-bar"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximizeButtonClick}
      >
        <span>C:\WINDOWS\SYSTEM32\COMMAND.COM</span>
        <div className="dos-terminal-window-controls">
          <button 
            className="dos-terminal-control-btn" 
            aria-label="Minimize (Close)" // Updated label
            onClick={handleMinimizeButtonClick}
          >
            _
          </button>
          <button 
            className="dos-terminal-control-btn" 
            aria-label={windowState === 'maximized' ? "Restore" : "Maximize"}
            onClick={handleMaximizeButtonClick}
          >
            {windowState === 'maximized' ? '❐' : '□'}
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
      {/* Content is always rendered now, as minimize closes the window */}
      <div ref={divRef} className="dos-terminal-content" style={{ height: 'calc(100% - 25px)', width: '100%' }} />
    </div>
  );
}

export default DosTerminal;