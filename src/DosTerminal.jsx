// src/DosTerminal.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

// --- Define the Fake File System ---
const fileSystem = {
  'C:': {
    type: 'directory',
    date: '01-01-80',
    time: '12:00AM',
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
  console.log(`[GFS] Searching for: "${path}"`); // Add prefix for clarity
  const parts = path.toUpperCase().split('\\').filter(p => p);
  console.log(`[GFS] Parsed parts:`, parts);

  if (parts.length === 0) {
    console.log("[GFS] Error: No parts after parsing.");
    return null;
  }

  // Handle root explicitly first ('C:' or 'C:\')
  if (parts.length === 1 && parts[0] === 'C:') {
    if (fs['C:'] && fs['C:'].type === 'directory') {
      console.log("[GFS] Success: Returning root C: entry.");
      return fs['C:']; // Return the C: object itself
    } else {
      console.log("[GFS] Error: C: entry not found or not a directory in filesystem root.");
      return null;
    }
  }

  // Check starting point is C:
  if (parts[0] !== 'C:') {
    console.log("[GFS] Error: Path does not start with C:");
    return null;
  }

  let currentLevel = fs['C:']; // Start at the C: object
  if (!currentLevel || currentLevel.type !== 'directory') {
    console.log("[GFS] Error: C: object not found or not a directory at start.");
    return null;
  }

  // Iterate through path components *after* C: (i starts at 1)
  for (let i = 1; i < parts.length; i++) {
    const partName = parts[i];
    console.log(`[GFS] Traversing to part ${i}: "${partName}"`);

    // Determine where to look for the next partName
    // If the currentLevel *is* the root object (fs['C:']), look directly within its properties.
    // Otherwise (if currentLevel is a subdirectory object), look within its 'children' property.
    const childrenSource = (currentLevel === fs['C:']) ? currentLevel : currentLevel.children;

    console.log(`[GFS]   CurrentLevel is root? ${currentLevel === fs['C:']}. Part name: ${partName}`);
    
    // Ensure childrenSource exists (especially important for subdirs that might lack a 'children' property)
    if (!childrenSource) {
        console.log(`[GFS]   Error: No children source found for current level.`);
        return null;
    }

    // Check if the part exists as a key in the correct source
    if (childrenSource.hasOwnProperty(partName)) { // Use hasOwnProperty for safety
      currentLevel = childrenSource[partName];
      console.log(`[GFS]   Found part "${partName}". New level type: ${currentLevel?.type}`);

      // If this is an *intermediate* part of the path, it *must* be a directory to continue.
      // We check this only if we are not at the last part (i < parts.length - 1).
      if (i < parts.length - 1) {
          if (!currentLevel || currentLevel.type !== 'directory') {
            console.log(`[GFS]   Error: Intermediate part "${partName}" is not a directory.`);
            return null; // Cannot traverse further through a file or invalid entry
          }
      }
      // If it's the last part, we don't care about the type here; we just return what we found.
      // The calling function (e.g., 'cd' or 'type') will validate the type if needed.

    } else {
      console.log(`[GFS]   Error: Part "${partName}" not found in children source.`);
      // console.log(`[GFS]   Children source keys:`, Object.keys(childrenSource)); // Log keys for debugging
      return null; // Specific part not found
    }
  }

  console.log(`[GFS] Success: Returning final entry for "${path}" of type ${currentLevel?.type}`, currentLevel);
  return currentLevel; // Return the final entry found (could be file or directory)
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
  // Store position/size before minimizing to restore accurately
  const [positionBeforeMinimize, setPositionBeforeMinimize] = useState({ x: 0, y: 0 });
  const [sizeBeforeMinimize, setSizeBeforeMinimize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (terminalWindowRef.current && terminalWindowRef.current.parentElement && !hasBeenDragged && windowState === 'normal') {
      const parentRect = terminalWindowRef.current.parentElement.getBoundingClientRect();
      const newSize = { width: parentRect.width, height: parentRect.height };
      
      if (initialSize.width === 0) setInitialSize(newSize);
      if (normalSizeBeforeMaximize.width === 0) setNormalSizeBeforeMaximize(newSize);
      if (sizeBeforeMinimize.width === 0) setSizeBeforeMinimize(newSize); // Initialize for minimize restore
      
      const newPosition = { x: parentRect.left, y: parentRect.top };
      if (position.x === 0 && position.y === 0) setPosition(newPosition);
      if (normalPositionBeforeMaximize.x === 0 && normalPositionBeforeMaximize.y === 0) setNormalPositionBeforeMaximize(newPosition);
      if (positionBeforeMinimize.x === 0 && positionBeforeMinimize.y === 0) setPositionBeforeMinimize(newPosition); // Initialize for minimize restore
    }
  }, [hasBeenDragged, windowState, initialSize, normalSizeBeforeMaximize, position, normalPositionBeforeMaximize, sizeBeforeMinimize, positionBeforeMinimize]);

  const handleMouseDown = (e) => {
    if (e.button !== 0 || windowState === 'maximized' || windowState === 'minimized') return; // Don't drag if maximized or minimized
    setIsDragging(true);
    
    if (!hasBeenDragged) {
      const parentElement = terminalWindowRef.current.parentElement;
      const currentWindowRect = terminalWindowRef.current.getBoundingClientRect();
      let referenceSize = { width: currentWindowRect.width, height: currentWindowRect.height };
      let referencePos = { x: currentWindowRect.left, y: currentWindowRect.top };

      if (parentElement) {
          const parentRect = parentElement.getBoundingClientRect();
          referenceSize = { width: parentRect.width, height: parentRect.height };
          referencePos = { x: parentRect.left, y: parentRect.top };
      }
      
      setInitialSize(referenceSize);
      setNormalSizeBeforeMaximize(referenceSize);
      setSizeBeforeMinimize(referenceSize); // Capture for minimize
      
      setPosition({ x: currentWindowRect.left, y: currentWindowRect.top });
      setNormalPositionBeforeMaximize(referencePos);
      setPositionBeforeMinimize(referencePos); // Capture for minimize
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
    setPosition({ x: 0, y: 0 }); 
    setInitialSize({ width: 0, height: 0 });
    setNormalSizeBeforeMaximize({ width: 0, height: 0 });
    setNormalPositionBeforeMaximize({ x: 0, y: 0 });
    setSizeBeforeMinimize({width: 0, height: 0});
    setPositionBeforeMinimize({x: 0, y: 0});
  };

  const handleMinimizeButtonClick = (e) => {
    e.stopPropagation();
    const currentRect = terminalWindowRef.current.getBoundingClientRect();

    if (windowState === 'minimized') {
      setWindowState('normal');
      setPosition(positionBeforeMinimize);
      // No need to setInitialSize here, let CSS/container handle normal size
      // Use a slightly longer delay for fit on restore
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 100); // Increased delay
    } else {
      // Store current position and size before minimizing IF IT'S NORMAL OR MAXIMIZED
      if (windowState === 'normal') {
        setPositionBeforeMinimize({ x: currentRect.left, y: currentRect.top });
        setSizeBeforeMinimize({ width: currentRect.width, height: currentRect.height });
      } else if (windowState === 'maximized') {
        setPositionBeforeMinimize(normalPositionBeforeMaximize);
        setSizeBeforeMinimize(normalSizeBeforeMaximize);
      }
      // If it's already minimized and clicked again, it will go to 'normal' (handled above)
      
      setWindowState('minimized');
    }
  };

  const handleMaximizeButtonClick = (e) => {
    e.stopPropagation();

    if (windowState === 'maximized') {
      setWindowState('normal');
      setPosition(normalPositionBeforeMaximize);
      // No need to setInitialSize here
      // Use a slightly longer delay for fit on restore
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 100); // Increased delay
    } else {
      const currentRect = terminalWindowRef.current.getBoundingClientRect();
      // If currently normal or minimized, store its current state as the "before maximize" state
      if (windowState === 'normal') {
        setNormalPositionBeforeMaximize({ x: currentRect.left, y: currentRect.top });
        setNormalSizeBeforeMaximize({ width: currentRect.width, height: currentRect.height });
      } else if (windowState === 'minimized') {
        setNormalPositionBeforeMaximize(positionBeforeMinimize);
        setNormalSizeBeforeMaximize(sizeBeforeMinimize);
      }
      
      setWindowState('maximized');
      // Use a slightly longer delay for fit on maximize
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 100); // Increased delay
    }
  };

  useEffect(() => {
    console.log("DosTerminal Main Initialization useEffect running."); // Add log

    let term;
    let currentCommand = ''; // Keep command state local to the effect scope
    let currentPath = 'C:\\'; // Keep path state local to the effect scope

    if (divRef.current && !termInstanceRef.current) {
      console.log("DosTerminal: Initializing NEW Terminal instance.");

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
      termInstanceRef.current = term; // Store the instance

      try {
        term.open(divRef.current);
        term.loadAddon(fitAddon);

        // Use a slight delay for initial fit after DOM attachment
        setTimeout(() => {
          try {
            fitAddon.fit();
            console.log(`DosTerminal: Initial Fit complete. Size: ${term.cols}x${term.rows}`);

            // --- Initial Terminal Output ---
            term.writeln("WEYLAND CORP (c) More human than human");
            term.writeln("MS-DOS Version 6.22");
            term.writeln("");
            term.writeln("Type 'help' for a list of available commands.");

            const updatePrompt = () => {
              term.write(`\r\n${currentPath.toUpperCase()}> `);
            };
            term.write(`${currentPath.toUpperCase()}> `); // Initial prompt

            // --- Key Listener Setup ---
            keyListenerRef.current?.dispose(); // Dispose previous listener just in case
            keyListenerRef.current = term.onKey(e => {
              const { key, domEvent } = e;
              const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

              if (domEvent.key === 'Enter') {
                term.writeln('');
                const [command, ...args] = currentCommand.trim().split(/\s+/);
                const processedCommand = command.toLowerCase();

                // --- Command Handling ---
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
                   navigate('/about'); // Use navigate from hook dependency
                 } else if (processedCommand === 'projects') {
                   term.writeln('Navigating to C:\\PROJECTS...');
                   navigate('/projects'); // Use navigate from hook dependency
                 } else if (processedCommand === 'dir') {
                    const dirToList = getFileSystemEntry(currentPath, fileSystem);

                    // Simplified check now works for root too, thanks to type: 'directory' on C:
                    if (dirToList && dirToList.type === 'directory') {
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

                        // Determine the children to iterate over.
                        // For C:\, children are direct properties. Use Object.keys filtered.
                        // For subdirs, children are in the .children property.
                        const childrenContainer = dirToList.children || dirToList;
                        const keysToList = Object.keys(childrenContainer).filter(key => key !== 'type' && key !== 'date' && key !== 'time' && key !== 'children'); // Filter out metadata keys

                        // Always show '.' and '..' for subdirectories
                        if (currentPath.toUpperCase() !== 'C:\\') {
                            const selfDirDate = dirToList.date || '01-01-80';
                            const selfDirTime = dirToList.time || '12:00AM';
                            term.writeln(`${formatName('.')}         <DIR>          ${selfDirDate}  ${selfDirTime}`);
                            // Ideally get parent's date/time for '..'
                            // For simplicity, using self's date/time for now.
                            term.writeln(`${formatName('..')}        <DIR>          ${selfDirDate}  ${selfDirTime}`);
                            totalDirs += 2;
                        }

                        keysToList.forEach(name => {
                            const item = childrenContainer[name];
                            const itemName = name.toUpperCase(); // Use the key as name
                            const itemDate = item.date || '01-01-80';
                            const itemTime = item.time || '12:00AM';

                            if (item.type === 'directory') {
                                term.writeln(`${formatName(itemName)}         <DIR>          ${itemDate}  ${itemTime}`);
                                totalDirs++;
                            } else if (item.type === 'file') {
                                const itemSize = item.size || 0;
                                term.writeln(`${formatName(itemName)}    ${padLeft(itemSize.toLocaleString(), 10)} ${itemDate}  ${itemTime}`);
                                totalFiles++;
                                totalBytes += itemSize;
                            }
                            // Ignore entries without a 'type'
                        });

                        term.writeln('');
                        term.writeln(` ${padLeft(totalFiles, 7)} file(s) ${padLeft(totalBytes.toLocaleString(), 12)} bytes`);
                        const fakeBytesFree = 512 * 1024 * 1024;
                        term.writeln(` ${padLeft(totalDirs, 7)} dir(s)  ${padLeft(fakeBytesFree.toLocaleString(), 12)} bytes free`);
                    } else {
                        term.writeln('Invalid path.'); // Should be less likely now
                    }
                 } else if (processedCommand === 'cd') {
                    const targetDirRaw = args.join(' ').trim();

                    if (!targetDirRaw) {
                      term.writeln(currentPath.toUpperCase());
                    } else {
                      const targetDir = targetDirRaw.toUpperCase();
                      let potentialNewPath;

                      if (targetDir === '..') {
                        const parts = currentPath.toUpperCase().split('\\').filter(p => p && p !== 'C:');
                        if (parts.length > 0) {
                          parts.pop(); // Go up one level
                          potentialNewPath = 'C:\\' + parts.join('\\');
                          if (parts.length > 0) {
                              potentialNewPath += '\\';
                          } else {
                             potentialNewPath = 'C:\\'; // Ensure it's exactly C:\ if parts is empty
                          }
                        } else {
                          potentialNewPath = 'C:\\';
                        }
                      } else if (targetDir.startsWith('C:\\')) {
                        potentialNewPath = targetDir;
                        if (!potentialNewPath.endsWith('\\') && potentialNewPath.toUpperCase() !== 'C:') { // Don't add slash if it *is* C:
                            potentialNewPath += '\\';
                        }
                        if (potentialNewPath.toUpperCase() === 'C:') { // Normalize C: to C:\
                           potentialNewPath = 'C:\\';
                        }
                      } else {
                        const basePath = currentPath.toUpperCase() === 'C:\\' ? currentPath : (currentPath.endsWith('\\') ? currentPath : currentPath + '\\');
                        potentialNewPath = basePath + targetDir;
                        if (!potentialNewPath.endsWith('\\')) {
                            potentialNewPath += '\\';
                        }
                      }

                      // Normalize edge case C: -> C:\ (redundant maybe, but safe)
                      if (potentialNewPath.toUpperCase() === 'C:') {
                          potentialNewPath = 'C:\\';
                      }

                      // Final check: Does the target directory exist?
                      console.log(`CD checking path: "${potentialNewPath}"`); // Add log before check
                      const entry = getFileSystemEntry(potentialNewPath, fileSystem);

                      // Simple check now works for root and subdirs
                      if (entry && entry.type === 'directory') {
                        currentPath = potentialNewPath.toUpperCase();
                      } else {
                        term.writeln('Invalid directory');
                        console.log(`CD command failed check for path: "${potentialNewPath}". Entry found:`, entry); // Log failure details
                      }
                    }
                 } else if (processedCommand === 'type') {
                    const fileName = args.join(' ').trim().toUpperCase();
                    if (!fileName) {
                        term.writeln('Usage: TYPE <filename>');
                    } else {
                        const currentDirEntry = getFileSystemEntry(currentPath, fileSystem);
                        let fileEntry = null;

                        // Use the correct source for children (direct properties for C:, .children for subdirs)
                        const childrenSource = currentDirEntry?.children || currentDirEntry;

                        if (currentDirEntry && currentDirEntry.type === 'directory' && childrenSource) {
                           fileEntry = childrenSource[fileName];
                        }

                        if (fileEntry && fileEntry.type === 'file') {
                          const lines = fileEntry.content.split('\n');
                          lines.forEach(line => term.writeln(line));
                        } else if (fileEntry && fileEntry.type === 'directory') {
                            term.writeln(`Access denied - ${fileName} is a directory.`);
                        } else {
                            term.writeln(`File not found - ${fileName}`);
                        }
                    }
                 } else if (processedCommand !== '') {
                   term.writeln(`Bad command or file name: ${processedCommand}`);
                 }
                 currentCommand = ''; // Reset local command variable
                 updatePrompt();
              } else if (domEvent.key === 'Backspace') {
                 if (currentPath && currentCommand.length > 0 && term.buffer.normal.cursorX > currentPath.length + 2) {
                   domEvent.preventDefault();
                   term.write('\b \b');
                   currentCommand = currentCommand.slice(0, -1); // Update local command variable
                 } else {
                   domEvent.preventDefault();
                 }
              } else if (printable && key.length === 1) {
                 currentCommand += key; // Update local command variable
                 term.write(key);
              }
            }); // end term.onKey

          } catch (fitError) {
            console.error("Error during initial fit/write:", fitError);
          }
        }, 50); // Increased delay slightly

      } catch (initError) {
        console.error("Error during direct xterm initialization:", initError);
        termInstanceRef.current = null; // Clear ref on error
      }
    } else {
        console.log("DosTerminal: Skipping initialization (already initialized or divRef missing).");
    }

    // --- Cleanup Function ---
    return () => {
      console.log("DosTerminal Main Initialization cleanup running.");
      // Dispose listener ONLY if we actually created one in this effect run
      // (Prevents issues if effect runs multiple times before term init)
      if (keyListenerRef.current) {
          keyListenerRef.current.dispose();
          keyListenerRef.current = null;
          console.log("Key listener disposed.");
      }
      // We should NOT dispose the terminal instance here anymore,
      // as we want it to persist across renders caused by non-dependency changes.
      // It will be disposed only when the DosTerminal component truly unmounts.
      // If you wanted true cleanup on unmount, you'd need another useEffect with empty deps.
      // Let's rely on the conditional rendering in App.jsx for unmounting/cleanup for now.

      // If you uncomment the below, it WILL reset on navigation if the effect re-runs for *any* reason
      // if (termInstanceRef.current) {
      //     console.log("Disposing terminal instance in cleanup.");
      //     termInstanceRef.current.dispose();
      //     termInstanceRef.current = null;
      // }
    };

  // MODIFICATION: Removed props.onClose from dependency array.
  // Only navigate needs to be here if commands use it.
  }, [navigate]); // End of main useEffect

  // --- Handler to focus terminal on click/tap ---
  const handleTerminalContentClick = () => {
    if (termInstanceRef.current) {
      termInstanceRef.current.focus();
      console.log("Terminal focused on click.");
    }
  };

  // --- Determine window style based on state ---
  let windowStyle = {};
  let contentStyle = { height: 'calc(100% - 25px)', width: '100%' }; // Default content style

  if (!hasBeenDragged && windowState === 'normal') {
    windowStyle = { /* Relies on parent .terminal-container */ };
  } else if (hasBeenDragged && windowState === 'normal') {
    windowStyle = {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${initialSize.width}px`,
      height: `${initialSize.height}px`,
    };
     // Ensure content height is correct relative to window height
     contentStyle = { height: `calc(${initialSize.height}px - 25px)`, width: '100%' };
  } else if (windowState === 'maximized') {
    windowStyle = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: 1001,
    };
     // Explicitly set content height for maximized state
     contentStyle = { height: 'calc(100vh - 25px)', width: '100%' };
  } else if (windowState === 'minimized') {
    // Style for a small bar, e.g., at the bottom or its last position
    windowStyle = {
      position: 'fixed',
      // If it was dragged, use its last position. Otherwise, default to bottom right.
      left: hasBeenDragged ? `${positionBeforeMinimize.x}px` : 'auto',
      top: hasBeenDragged ? `${positionBeforeMinimize.y}px` : 'auto',
      right: !hasBeenDragged ? '20px' : 'auto',
      bottom: !hasBeenDragged ? '20px' : 'auto',
      width: hasBeenDragged ? `${sizeBeforeMinimize.width * 0.3}px` : '200px', // Smaller width
      height: '25px', // Just the title bar height
      overflow: 'hidden',
      zIndex: 1000, // Same as normal draggable
    };
  }

  return (
    <div
      ref={terminalWindowRef}
      className={`dos-terminal-window ${windowState === 'minimized' ? 'minimized' : ''}`}
      style={windowStyle}
    >
      <div
        className="dos-terminal-title-bar"
        onMouseDown={handleMouseDown}
        // Double click to restore if minimized, otherwise toggle maximize
        onDoubleClick={windowState === 'minimized' ? handleMinimizeButtonClick : handleMaximizeButtonClick}
      >
        <span>MS-DOS Prompt</span>
        <div className="dos-terminal-window-controls">
          <button 
            className="dos-terminal-control-btn" 
            aria-label={windowState === 'minimized' ? "Restore" : "Minimize"}
            onClick={handleMinimizeButtonClick}
          >
            {windowState === 'minimized' ? '❐' : '_'} {/* Restore/Minimize icons */}
          </button>
          <button 
            className="dos-terminal-control-btn" 
            aria-label={windowState === 'maximized' ? "Restore" : "Maximize"}
            onClick={handleMaximizeButtonClick}
            disabled={windowState === 'minimized'} // Disable maximize when minimized
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
      {/* Apply dynamic contentStyle AND ADD onClick HANDLER */}
      <div 
        ref={divRef} 
        className="dos-terminal-content" 
        style={contentStyle} 
        onClick={handleTerminalContentClick} // ADDED: Focus on click/tap
      />
    </div>
  );
}

export default DosTerminal;