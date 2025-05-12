// src/DosTerminal.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

// --- Define the Fake File System ---
const fileSystem = {
  'C:': {
    'AUTOEXEC.BAT': { type: 'file', content: '@ECHO OFF\nPROMPT $P$G\nPATH C:\\DOS;C:\\WINDOWS;C:\\UTILS\nLH MOUSE.COM\nLH SMARTDRV.EXE\nWIN', date: '07-22-94', time: '10:30AM', size: 128 },
    'CONFIG.SYS': { type: 'file', content: 'DEVICE=C:\\DOS\\HIMEM.SYS\nDEVICE=C:\\DOS\\EMM386.EXE NOEMS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=20\nSTACKS=9,256', date: '07-20-94', time: '09:15AM', size: 96 },
    'COMMAND.COM': { type: 'file', content: 'MS-DOS Command Interpreter Version 6.22', date: '05-31-94', time: '06:22AM', size: 54649 },
    'MOUSE.COM': { type: 'file', content: 'Generic Mouse Driver', date: '01-15-93', time: '12:00PM', size: 15230 },
    'DOS': {
      type: 'directory',
      date: '06-10-94', time: '02:00PM',
      children: {
        'HIMEM.SYS': { type: 'file', content: 'Extended Memory Manager', date: '05-31-94', time: '06:22AM', size: 45056 },
        'EMM386.EXE': { type: 'file', content: 'Expanded Memory Manager', date: '05-31-94', time: '06:22AM', size: 121427 },
        'FORMAT.COM': { type: 'file', content: 'Format Utility', date: '05-31-94', time: '06:22AM', size: 22912 },
        'EDIT.COM': { type: 'file', content: 'MS-DOS Editor', date: '05-31-94', time: '06:22AM', size: 413 },
      }
    },
    'WINDOWS': { // Representing Windows 3.1
      type: 'directory',
      date: '08-01-94', time: '11:00AM',
      children: {
        'SYSTEM': { type: 'directory', date: '08-01-94', time: '11:05AM', children: {
            'SYSTEM.INI': { type: 'file', content: '[boot]\nshell=progman.exe', date: '08-15-94', time: '03:45PM', size: 2048 },
            'WINFILE.EXE': { type: 'file', content: 'Windows File Manager', date: '04-10-92', time: '03:10AM', size: 168432 },
        }},
        'PROGMAN.EXE': { type: 'file', content: 'Windows Program Manager', date: '04-10-92', time: '03:10AM', size: 145120 },
        'WIN.INI': { type: 'file', content: '[windows]\nload=\nrun=', date: '08-15-94', time: '03:50PM', size: 1536 },
        'SOL.EXE': { type: 'file', content: 'Solitaire Game', date: '04-10-92', time: '03:10AM', size: 67232 },
      }
    },
    'PROJECTS': { // Your existing projects folder
      type: 'directory',
      date: '10-15-95', time: '04:30PM',
      children: {
        'OVERLORD.TXT': { type: 'file', content: 'Project Overlord: Status - ACTIVE. Objective: AI Sentience.\nContact: Dr. Aris Thorne.', date: '11-01-95', time: '09:00AM', size: 1204 },
        'CHIMERA.DAT': { type: 'file', content: 'CLASSIFIED DATA - ACCESS RESTRICTED', date: '12-05-95', time: '06:00PM', size: 8192 }
      }
    },
    'WELCOME.TXT': { type: 'file', content: 'Welcome to the Weyland Corp Mainframe.\nUse DIR to list files, CD to change directory, TYPE to view files.', date: '01-01-96', time: '12:01AM', size: 150 },
    'README.MD': { type: 'file', content: 'SYSTEM NOTICE: Unauthorized access is monitored and prosecuted.', date: '01-01-96', time: '12:05AM', size: 80 }
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
                term.writeln("MS-DOS Version 6.22");
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
                        const currentDirEntry = getFileSystemEntry(currentPath, fileSystem);
                        if (currentDirEntry && currentDirEntry.type === 'directory') {
                            term.writeln(` Volume in drive C is WEYLAND_OS`);
                            term.writeln(` Volume Serial Number is 1986-0426`);
                            term.writeln(` Directory of ${currentPath.toUpperCase()}`);
                            term.writeln('');
                            
                            let totalFiles = 0;
                            let totalDirs = 0;
                            let totalBytes = 0;

                            const formatName = (name) => {
                                if (name.includes('.')) {
                                    const parts = name.split('.');
                                    return parts[0].substring(0, 8).padEnd(8) + ' ' + parts[1].substring(0, 3).padEnd(3);
                                }
                                return name.substring(0, 8).padEnd(8) + '   ';
                            };
                            
                            const padLeft = (str, len) => String(str).padStart(len, ' ');

                            if (currentPath.toUpperCase() !== 'C:\\') {
                                const parentDirDate = currentDirEntry.date || '01-01-80';
                                const parentDirTime = currentDirEntry.time || '12:00AM';
                                term.writeln(`${formatName('.')}         <DIR>          ${parentDirDate}  ${parentDirTime}`);
                                term.writeln(`${formatName('..')}        <DIR>          ${parentDirDate}  ${parentDirTime}`);
                                totalDirs +=2;
                            }

                            Object.entries(currentDirEntry.children).forEach(([name, item]) => {
                                const itemName = name.toUpperCase();
                                const itemDate = item.date || '01-01-80';
                                const itemTime = item.time || '12:00AM';

                                if (item.type === 'directory') {
                                    term.writeln(`${formatName(itemName)}         <DIR>          ${itemDate}  ${itemTime}`);
                                    totalDirs++;
                                } else {
                                    const itemSize = item.size || 0;
                                    term.writeln(`${formatName(itemName)}    ${padLeft(itemSize.toLocaleString(), 10)} ${itemDate}  ${itemTime}`);
                                    totalFiles++;
                                    totalBytes += itemSize;
                                }
                            });
                            term.writeln('');
                            term.writeln(` ${padLeft(totalFiles, 7)} file(s) ${padLeft(totalBytes.toLocaleString(), 12)} bytes`);
                            const fakeBytesFree = 512 * 1024 * 1024;
                            term.writeln(` ${padLeft(totalDirs, 7)} dir(s)  ${padLeft(fakeBytesFree.toLocaleString(), 12)} bytes free`);
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
        <span>MS-DOS Prompt</span>
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