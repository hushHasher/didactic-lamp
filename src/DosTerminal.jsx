// src/DosTerminal.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
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
    if (Object.prototype.hasOwnProperty.call(childrenSource, partName)) { // Use safe hasOwnProperty check
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

// ADDED: List of safe, non-navigating, non-exiting commands for auto-execution
const autoCommands = [
  { cmd: 'dir', args: [] },
  { cmd: 'help', args: [] },
  { cmd: 'type', args: ['WELCOME.TXT'] },
  { cmd: 'type', args: ['README.MD'] }, // Assuming README.MD exists and is safe to type
  // Add more simple commands if desired, e.g., dir DOS, dir WINDOWS
  { cmd: 'dir', args: ['DOS'] },
  { cmd: 'dir', args: ['WINDOWS'] },
];

function DosTerminal(props) {
  const { onClose, shouldFocusOnOpen } = props; // Destructure props
  const divRef = useRef(null);
  const termInstanceRef = useRef(null);
  const fitAddonInstanceRef = useRef(null);
  const keyListenerRef = useRef(null);
  const dataListenerRef = useRef(null);
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

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    let newX = e.clientX - dragStartOffset.x;
    let newY = e.clientY - dragStartOffset.y;

    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStartOffset.x, dragStartOffset.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
    onClose?.();
    setWindowState('normal'); 
    setHasBeenDragged(false);
    setPosition({ x: 0, y: 0 }); 
    setInitialSize({ width: 0, height: 0 });
    setNormalSizeBeforeMaximize({ width: 0, height: 0 });
    setNormalPositionBeforeMaximize({ x: 0, y: 0 });
    setSizeBeforeMinimize({width: 0, height: 0});
    setPositionBeforeMinimize({x: 0, y: 0});

    if (termInstanceRef.current) {
      console.log("[DosTerminal-CloseButton] Disposing terminal instance.");
      termInstanceRef.current.dispose();
      termInstanceRef.current = null;
      if (keyListenerRef.current) { keyListenerRef.current.dispose(); keyListenerRef.current = null; }
      if (dataListenerRef.current) { dataListenerRef.current.dispose(); dataListenerRef.current = null; }
    }
  };

  const handleMinimizeButtonClick = (e) => {
    e.stopPropagation();
    const currentRect = terminalWindowRef.current.getBoundingClientRect();

    if (windowState === 'minimized') {
      setWindowState('normal');
      setPosition(positionBeforeMinimize);
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 100);
    } else {
      if (windowState === 'normal') {
        setPositionBeforeMinimize({ x: currentRect.left, y: currentRect.top });
        setSizeBeforeMinimize({ width: currentRect.width, height: currentRect.height });
      } else if (windowState === 'maximized') {
        setPositionBeforeMinimize(normalPositionBeforeMaximize);
        setSizeBeforeMinimize(normalSizeBeforeMaximize);
      }
      setWindowState('minimized');
    }
  };

  const handleMaximizeButtonClick = (e) => {
    e.stopPropagation();

    if (windowState === 'maximized') {
      setWindowState('normal');
      setPosition(normalPositionBeforeMaximize);
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 100);
    } else {
      const currentRect = terminalWindowRef.current.getBoundingClientRect();
      if (windowState === 'normal') {
        setNormalPositionBeforeMaximize({ x: currentRect.left, y: currentRect.top });
        setNormalSizeBeforeMaximize({ width: currentRect.width, height: currentRect.height });
      } else if (windowState === 'minimized') {
        setNormalPositionBeforeMaximize(positionBeforeMinimize);
        setNormalSizeBeforeMaximize(sizeBeforeMinimize);
      }
      setWindowState('maximized');
      setTimeout(() => fitAddonInstanceRef.current?.fit(), 100);
    }
  };

  useEffect(() => {
    console.log("[DosTerminal-MainEffect] Initializing or re-running.");

    let term;
    let currentCommand = ''; // This will be managed by the auto-command runner initially
    let currentPath = 'C:\\';
    let processingAutoCommand = false; // Flag to disable user input during auto commands
    let autoCommandTimerId = null; // Added: To store the setTimeout ID for auto commands

    // Helper function to process a single command programmatically (subset of onKey Enter logic)
    const processCommandInternally = (commandString, termInstance, path) => {
      // This function will be called by the auto-command runner.
      // It needs access to termInstance and path (currentPath for CD)
      // It should return the new path if CD command was successful.
      console.log(`[AutoCmd] Processing internally: ${commandString}`);
      const [cmd, ...args] = commandString.trim().split(/\s+/);
      const processedCmd = cmd.toLowerCase();
      let newPath = path; // Keep track of path changes for subsequent auto-commands

      // --- Replicated Command Handling Logic (Simplified for auto-commands) ---
      // IMPORTANT: Ensure this logic doesn't call navigate() or onClose() for auto-commands
      if (processedCmd === 'help') {
        termInstance.writeln('Available commands:');
        termInstance.writeln('  help          - Displays this help message.');
        termInstance.writeln('  about         - Navigates to the About section.');
        termInstance.writeln('  projects      - Navigates to the Projects section.');
        termInstance.writeln('  dir           - Lists files and directories.');
        termInstance.writeln('  cd <dir>      - Changes current directory. Use "cd .." to go up.');
        termInstance.writeln('  type <file>   - Displays the content of a file.');
        termInstance.writeln('  clear         - Clears the terminal screen.');
        termInstance.writeln('  exit          - Closes the terminal interface.');
      } else if (processedCmd === 'clear') {
         termInstance.clear();
      } else if (processedCmd === 'dir') {
          const dirToListPath = args.length > 0 ? (path + args.join(' ').toUpperCase() + '\\') : path;
          const dirToList = getFileSystemEntry(dirToListPath, fileSystem);
          if (dirToList && dirToList.type === 'directory') {
              termInstance.writeln(` Volume in drive C is WEYLAND_OS`);
              termInstance.writeln(` Volume Serial Number is 1986-0426`);
              termInstance.writeln(` Directory of ${dirToListPath.toUpperCase()}`);
              termInstance.writeln('');
              let totalFiles = 0, totalDirs = 0, totalBytes = 0;
              const formatName = (name) => name.includes('.') ? name.split('.')[0].substring(0, 8).padEnd(8) + ' ' + name.split('.')[1].substring(0, 3).padEnd(3) : name.substring(0, 8).padEnd(8) + '   ';
              const padLeft = (str, len) => String(str).padStart(len, ' ');
              const childrenContainer = dirToList.children || dirToList;
              const keysToList = Object.keys(childrenContainer).filter(k => k !== 'type' && k !== 'date' && k !== 'time' && k !== 'children');
              if (dirToListPath.toUpperCase() !== 'C:\\') {
                  termInstance.writeln(`${formatName('.')}         <DIR>          ${dirToList.date || '01-01-80'}  ${dirToList.time || '12:00AM'}`);
                  termInstance.writeln(`${formatName('..')}        <DIR>          ${dirToList.date || '01-01-80'}  ${dirToList.time || '12:00AM'}`);
                  totalDirs += 2;
              }
              keysToList.forEach(name => {
                  const item = childrenContainer[name];
                  if (item.type === 'directory') { termInstance.writeln(`${formatName(name.toUpperCase())}         <DIR>          ${item.date || '01-01-80'}  ${item.time || '12:00AM'}`); totalDirs++; }
                  else if (item.type === 'file') { const size = item.size || 0; termInstance.writeln(`${formatName(name.toUpperCase())}    ${padLeft(size.toLocaleString(), 10)} ${item.date || '01-01-80'}  ${item.time || '12:00AM'}`); totalFiles++; totalBytes += size; }
              });
              termInstance.writeln('');
              termInstance.writeln(` ${padLeft(totalFiles, 7)} file(s) ${padLeft(totalBytes.toLocaleString(), 12)} bytes`);
              termInstance.writeln(` ${padLeft(totalDirs, 7)} dir(s)  ${padLeft((512 * 1024 * 1024).toLocaleString(), 12)} bytes free`);
          } else { termInstance.writeln('Invalid path for DIR.'); }
      } else if (processedCmd === 'type') {
          const fileName = args.join(' ').trim().toUpperCase();
          if (!fileName) { termInstance.writeln('Usage: TYPE <filename>'); }
          else {
              const currentDirEntry = getFileSystemEntry(path, fileSystem);
              let fileEntry = null;
              const childrenSource = currentDirEntry?.children || currentDirEntry;
              if (currentDirEntry && currentDirEntry.type === 'directory' && childrenSource) { fileEntry = childrenSource[fileName]; }
              if (fileEntry && fileEntry.type === 'file') { fileEntry.content.split('\n').forEach(line => termInstance.writeln(line)); }
              else if (fileEntry && fileEntry.type === 'directory') { termInstance.writeln(`Access denied - ${fileName} is a directory.`); }
              else { termInstance.writeln(`File not found - ${fileName}`); }
          }
      // Add other safe commands here if needed, ensure they don't navigate or exit.
      // Specifically, do NOT include 'about', 'projects', 'exit' in auto-run logic if they call navigate() or onClose()
      // The 'cd' command is tricky for auto-run unless path state is carefully managed.
      // For simplicity, the autoCommands list above avoids 'cd'.
      } else if (processedCmd !== '') {
        termInstance.writeln(`Bad command or file name: ${processedCmd}`);
      }
      return newPath; // Return path (might be updated if 'cd' was implemented for auto)
    };

    if (divRef.current && !termInstanceRef.current) {
      console.log("[DosTerminal-MainEffect] Initializing NEW Terminal instance.");

      // ALWAYS create a new FitAddon for a new Terminal instance
      const newFitAddon = new FitAddon();
      fitAddonInstanceRef.current = newFitAddon; // Update the ref to point to the new addon

      term = new Terminal({
        cursorBlink: true,
        cursorStyle: 'block',
        fontFamily: 'monospace',
        allowProposedApi: true,
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
        term.loadAddon(newFitAddon); // Load the NEW addon

        // Assign the timer ID to autoCommandTimerId
        autoCommandTimerId = setTimeout(async () => { // Made outer setTimeout async to use await for delays
          try {
            // Before doing anything, check if the terminal instance this timeout was for still exists
            // This is a safeguard, primary fix is clearing the timeout on unmount.
            if (!termInstanceRef.current || termInstanceRef.current !== term) {
                console.warn("[DosTerminal-AutoCmdTimeout] Stale timeout for a disposed/recreated terminal. Skipping execution.");
                return;
            }
            newFitAddon.fit(); // Call fit() on the NEW addon
            term.writeln("WEYLAND CORP (c) More human than human");
            term.writeln("MS-DOS Version 6.22");
            term.writeln("");
            // No initial "Type help..." here, auto commands will run first

            processingAutoCommand = true; // Disable user input
            term.focus(); // Focus the terminal for visual effect if desired

            const numAutoCommands = Math.floor(Math.random() * 2) + 3; // 3 or 4 commands
            const commandsToRun = [];
            const usedIndices = new Set();

            while (commandsToRun.length < numAutoCommands && usedIndices.size < autoCommands.length) {
              const randomIndex = Math.floor(Math.random() * autoCommands.length);
              if (!usedIndices.has(randomIndex)) {
                commandsToRun.push(autoCommands[randomIndex]);
                usedIndices.add(randomIndex);
              }
            }
            
            let autoCommandPath = currentPath; // Use a local path for auto commands session

            for (const autoCmdObj of commandsToRun) {
              const commandString = `${autoCmdObj.cmd} ${autoCmdObj.args.join(' ')}`.trim();
              term.write(`\r\n${autoCommandPath.toUpperCase()}> ${commandString}`);
              await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400)); // Short delay after typing
              term.writeln(''); // Newline for command output
              autoCommandPath = processCommandInternally(commandString, term, autoCommandPath); // Process and get new path
              await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500)); // Delay after command output
            }

            processingAutoCommand = false; // Re-enable user input processing
            term.writeln("\nType 'help' for a list of available commands."); // Now show help prompt
            updatePrompt(); // Show final prompt for user

            // Setup user input listeners AFTER auto commands are done
            keyListenerRef.current?.dispose();
            dataListenerRef.current?.dispose();

            keyListenerRef.current = term.onKey(e => {
              if (processingAutoCommand) return; // Ignore user input during auto commands
              const { domEvent } = e;
              if (domEvent.key === 'Enter') {
                // ... (existing Enter logic, ensuring it uses 'currentPath' and updates 'currentCommand')
                console.log(`[DosTerminal-onKey-Enter] Current command: '${currentCommand}'`);
                term.writeln('');
                const [command, ...args] = currentCommand.trim().split(/\s+/);
                const processedCommand = command.toLowerCase();
                console.log(`[DosTerminal-onKey-Enter] Processing command: '${processedCommand}', Args:`, args);
                if (processedCommand === 'about') {
                   term.writeln('Navigating to C:\\ABOUT...');
                   navigate('/about'); 
                   onClose?.();
                 } else if (processedCommand === 'projects') {
                   term.writeln('Navigating to C:\\PROJECTS...');
                   navigate('/projects'); 
                   onClose?.();
                 } else if (processedCommand === 'exit') {
                   term.writeln('Closing terminal interface...');
                   onClose?.();
                 } else if (processedCommand === 'help') {
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
                 } else if (processedCommand === 'dir') {
                    const dirToList = getFileSystemEntry(currentPath, fileSystem);
                    if (dirToList && dirToList.type === 'directory') {
                        term.writeln(` Volume in drive C is WEYLAND_OS`);
                        term.writeln(` Volume Serial Number is 1986-0426`);
                        term.writeln(` Directory of ${currentPath.toUpperCase()}`);
                        term.writeln('');
                        let totalFiles = 0; let totalDirs = 0; let totalBytes = 0;
                        const formatName = (name) => name.includes('.') ? name.split('.')[0].substring(0, 8).padEnd(8) + ' ' + name.split('.')[1].substring(0, 3).padEnd(3) : name.substring(0, 8).padEnd(8) + '   ';
                        const padLeft = (str, len) => String(str).padStart(len, ' ');
                        const childrenContainer = dirToList.children || dirToList;
                        const keysToList = Object.keys(childrenContainer).filter(k => k !== 'type' && k !== 'date' && k !== 'time' && k !== 'children');
                        if (currentPath.toUpperCase() !== 'C:\\') {
                            term.writeln(`${formatName('.')}         <DIR>          ${dirToList.date || '01-01-80'}  ${dirToList.time || '12:00AM'}`);
                            term.writeln(`${formatName('..')}        <DIR>          ${dirToList.date || '01-01-80'}  ${dirToList.time || '12:00AM'}`);
                            totalDirs += 2;
                        }
                        keysToList.forEach(name => {
                            const item = childrenContainer[name];
                            if (item.type === 'directory') { term.writeln(`${formatName(name.toUpperCase())}         <DIR>          ${item.date || '01-01-80'}  ${item.time || '12:00AM'}`); totalDirs++; }
                            else if (item.type === 'file') { const size = item.size || 0; term.writeln(`${formatName(name.toUpperCase())}    ${padLeft(size.toLocaleString(), 10)} ${item.date || '01-01-80'}  ${item.time || '12:00AM'}`); totalFiles++; totalBytes += size; }
                        });
                        term.writeln('');
                        term.writeln(` ${padLeft(totalFiles, 7)} file(s) ${padLeft(totalBytes.toLocaleString(), 12)} bytes`);
                        term.writeln(` ${padLeft(totalDirs, 7)} dir(s)  ${padLeft((512 * 1024 * 1024).toLocaleString(), 12)} bytes free`);
                    } else { term.writeln('Invalid path.'); }
                 } else if (processedCommand === 'cd') {
                    const targetDirRaw = args.join(' ').trim();
                    if (!targetDirRaw) { term.writeln(currentPath.toUpperCase());
                    } else {
                        const targetDir = targetDirRaw.toUpperCase(); let potentialNewPath;
                        if (targetDir === '..') { const parts = currentPath.toUpperCase().split('\\').filter(p=>p&&p!=='C:'); if(parts.length>0){parts.pop(); potentialNewPath='C:\\' + parts.join('\\'); if(parts.length>0){potentialNewPath+='\\';}else{potentialNewPath='C:\\';}}else{potentialNewPath='C:\\';}}
                        else if (targetDir.startsWith('C:\\')) { potentialNewPath = targetDir; if(!potentialNewPath.endsWith('\\')&&potentialNewPath.toUpperCase()!=='C:'){potentialNewPath+='\\';} if(potentialNewPath.toUpperCase()==='C:'){potentialNewPath='C:\\';} }
                        else { const basePath=currentPath.toUpperCase()==='C:\\'?currentPath:(currentPath.endsWith('\\')?currentPath:currentPath+'\\'); potentialNewPath=basePath+targetDir; if(!potentialNewPath.endsWith('\\')){potentialNewPath+='\\';} }
                        if (potentialNewPath.toUpperCase()==='C:'){potentialNewPath='C:\\';}
                        console.log(`[DosTerminal-onKey-CD] checking path: "${potentialNewPath}"`);
                        const entry = getFileSystemEntry(potentialNewPath, fileSystem);
                        if (entry && entry.type === 'directory') { currentPath = potentialNewPath.toUpperCase(); } 
                        else { term.writeln('Invalid directory'); console.log(`[DosTerminal-onKey-CD] command failed check for path: "${potentialNewPath}". Entry found:`, entry); }
                    }
                 } else if (processedCommand === 'type') {
                    const fileName = args.join(' ').trim().toUpperCase();
                    if (!fileName) { term.writeln('Usage: TYPE <filename>');
                    } else {
                        const currentDirEntry = getFileSystemEntry(currentPath, fileSystem);
                        let fileEntry = null; const childrenSource = currentDirEntry?.children || currentDirEntry;
                        if (currentDirEntry && currentDirEntry.type === 'directory' && childrenSource) { fileEntry = childrenSource[fileName]; }
                        if (fileEntry && fileEntry.type === 'file') { fileEntry.content.split('\n').forEach(line => term.writeln(line)); }
                        else if (fileEntry && fileEntry.type === 'directory') { term.writeln(`Access denied - ${fileName} is a directory.`); }
                        else { term.writeln(`File not found - ${fileName}`); }
                    }
                 } else if (processedCommand !== '') {
                   term.writeln(`Bad command or file name: ${processedCommand}`);
                 }
                currentCommand = '';
                console.log(`[DosTerminal-onKey-Enter] currentCommand reset. About to call updatePrompt.`);
                if (processedCommand !== 'about' && processedCommand !== 'projects' && processedCommand !== 'exit') {
                    updatePrompt(); 
                }
              } else if (domEvent.key === 'Backspace') {
                if (processingAutoCommand) return;
                // ... (existing Backspace logic, using 'currentCommand')
                if (currentPath && currentCommand.length > 0 && term.buffer.normal.cursorX > currentPath.length + 2) { domEvent.preventDefault(); term.write('\b \b'); currentCommand = currentCommand.slice(0, -1); }
                else { domEvent.preventDefault(); }

              }
            });

            dataListenerRef.current = term.onData(data => {
              if (processingAutoCommand) return;
              // ... (existing onData logic, using 'currentCommand' and filtering escape codes)
              if (data.startsWith('\x1b')) { return; }
              if (data === '\r' || data === '\n' || data === '\r\n') { return; }
              if (data.charCodeAt(0) === 127 || data === '\b') { return; }
              currentCommand += data;
              term.write(data);
            });

            term.focus(); // ADDED: Ensure focus AFTER listeners are set and auto-commands are done
            console.log("[DosTerminal-AutoCmdEnd] Listeners re-set, terminal explicitly focused."); // ADDED: Log

            const updatePrompt = () => { // Ensure updatePrompt uses the correct 'currentPath'
              const promptText = `\r\n${currentPath.toUpperCase()}> `;
              // console.log(`[DosTerminal-UpdatePrompt] Attempting to write prompt: "${promptText.replace('\r\n','\\r\\n')}"`);
              term.write(promptText);
            };

          } catch (fitError) {
            console.error("[DosTerminal-MainEffect] Error during initial fit/write/auto-commands:", fitError);
          }
        }, 50);

      } catch (initError) {
        console.error("[DosTerminal-MainEffect] Error during direct xterm initialization:", initError);
        termInstanceRef.current = null;
      }
    } else {
        console.log("[DosTerminal-MainEffect] Skipping initialization (already initialized or divRef missing).");
    }

    return () => {
      console.log("[DosTerminal-MainEffect-Cleanup] Running cleanup.");
      if (autoCommandTimerId) { // Added: Clear the timeout if it was set
        clearTimeout(autoCommandTimerId);
        console.log("[DosTerminal-MainEffect-Cleanup] Cleared auto-command setTimeout.");
      }
      keyListenerRef.current?.dispose(); keyListenerRef.current = null;
      dataListenerRef.current?.dispose(); dataListenerRef.current = null;
      if (termInstanceRef.current) {
          console.log("[DosTerminal-MainEffect-Cleanup] Disposing terminal instance on component unmount.");
          termInstanceRef.current.dispose();
          termInstanceRef.current = null;
      }
    };
  }, [navigate, onClose]); // End of main useEffect

  // useEffect for focusing when shouldFocusOnOpen becomes true
  useEffect(() => {
    if (shouldFocusOnOpen && termInstanceRef.current) {
      console.log("[DosTerminal-FocusEffect] Auto-focusing terminal due to shouldFocusOnOpen.");
      termInstanceRef.current.focus();
    }
  }, [shouldFocusOnOpen]);

  // --- Handler to focus terminal on click/tap ---
  const handleTerminalContentClick = () => {
    if (termInstanceRef.current) {
      termInstanceRef.current.focus();
      console.log("[DosTerminal-ContentClick] Terminal focused on click.");
    }
  };

  // --- Determine window style based on state ---
  let windowStyle = {};
  let contentStyle = { height: 'calc(100% - 25px)', width: '100%' };

  if (!hasBeenDragged && windowState === 'normal') {
    windowStyle = { };
  } else if (hasBeenDragged && windowState === 'normal') {
    windowStyle = {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${initialSize.width}px`,
      height: `${initialSize.height}px`,
    };
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
     contentStyle = { height: 'calc(100vh - 25px)', width: '100%' };
  } else if (windowState === 'minimized') {
    windowStyle = {
      position: 'fixed',
      left: hasBeenDragged ? `${positionBeforeMinimize.x}px` : 'auto',
      top: hasBeenDragged ? `${positionBeforeMinimize.y}px` : 'auto',
      right: !hasBeenDragged ? '20px' : 'auto',
      bottom: !hasBeenDragged ? '20px' : 'auto',
      width: hasBeenDragged ? `${sizeBeforeMinimize.width * 0.3}px` : '200px',
      height: '25px',
      overflow: 'hidden',
      zIndex: 1000,
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
        onDoubleClick={windowState === 'minimized' ? handleMinimizeButtonClick : handleMaximizeButtonClick}
      >
        <span>MS-DOS Prompt</span>
        <div className="dos-terminal-window-controls">
          <button 
            className="dos-terminal-control-btn" 
            aria-label={windowState === 'minimized' ? "Restore" : "Minimize"}
            onClick={handleMinimizeButtonClick}
          >
            {windowState === 'minimized' ? '❐' : '_'}
          </button>
          <button 
            className="dos-terminal-control-btn" 
            aria-label={windowState === 'maximized' ? "Restore" : "Maximize"}
            onClick={handleMaximizeButtonClick}
            disabled={windowState === 'minimized'}
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
      <div 
        ref={divRef} 
        className="dos-terminal-content" 
        style={contentStyle} 
        onClick={handleTerminalContentClick}
      />
    </div>
  );
}

export default DosTerminal;