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
// Traverses the 'fs' object based on a string 'path' (e.g., "C:\DOS\FORMAT.COM")
function getFileSystemEntry(path, fs) {
  const parts = path.toUpperCase().split('\\').filter(p => p); // Normalize and split path

  if (parts.length === 0) { // Empty path is invalid
    return null;
  }

  // Handle root explicitly first ('C:' or 'C:\')
  if (parts.length === 1 && parts[0] === 'C:') {
    if (fs['C:'] && fs['C:'].type === 'directory') {
      return fs['C:']; // Return the C: directory object
    } else {
      return null; // C: drive not found or not a directory
    }
  }

  // Path must start with 'C:'
  if (parts[0] !== 'C:') {
    return null;
  }

  let currentLevel = fs['C:']; // Start traversal from the C: root
  if (!currentLevel || currentLevel.type !== 'directory') {
    return null; // C: root is missing or invalid
  }

  // Iterate through path components *after* 'C:' (parts[0])
  for (let i = 1; i < parts.length; i++) {
    const partName = parts[i];

    // 'children' property holds subdirectory contents.
    // For the C: drive itself, its properties are the children.
    const childrenSource = (currentLevel === fs['C:']) ? currentLevel : currentLevel.children;
    
    if (!childrenSource) { // No children found where expected
        return null;
    }

    // Check if the current part of the path exists in the current directory level
    if (Object.prototype.hasOwnProperty.call(childrenSource, partName)) {
      currentLevel = childrenSource[partName]; // Move to the next level

      // If this is an intermediate part of the path, it must be a directory
      if (i < parts.length - 1) { // Not the last part of the path
          if (!currentLevel || currentLevel.type !== 'directory') {
            return null; // Intermediate path segment is not a directory
          }
      }
    } else {
      return null; // Path segment not found
    }
  }
  return currentLevel; // Return the final file or directory entry
}

// List of commands for auto-execution upon terminal start
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
  const { onClose } = props; // onClose callback to close the terminal
  const divRef = useRef(null); // Ref for the div where Xterm will be mounted
  const termInstanceRef = useRef(null); // Ref to store the Xterm Terminal instance
  const fitAddonInstanceRef = useRef(null); // Ref for Xterm FitAddon instance
  const keyListenerRef = useRef(null); // Ref for Xterm key event listener disposable
  const dataListenerRef = useRef(null); // Ref for Xterm data event listener disposable
  const navigate = useNavigate(); // React Router navigation hook
  const terminalWindowRef = useRef(null); // Ref for the draggable/resizable terminal window div

  // --- Window State Management ---
  // `position`: Current {x, y} coordinates of the terminal window.
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // `isDragging`: Boolean, true if the window is currently being dragged.
  const [isDragging, setIsDragging] = useState(false);
  // `dragStartOffset`: {x, y} offset from mouse click to window's top-left corner during drag.
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  // `hasBeenDragged`: Boolean, true if the window has been dragged at least once. Affects initial positioning.
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  // `initialSize`: {width, height} of the terminal, captured before first drag or from parent.
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  // `windowState`: Manages if the window is 'normal', 'minimized', or 'maximized'.
  const [windowState, setWindowState] = useState('normal');
  // `normalSizeBeforeMaximize`: Stores {width, height} before maximizing, to restore later.
  const [normalSizeBeforeMaximize, setNormalSizeBeforeMaximize] = useState({ width: 0, height: 0 });
  // `normalPositionBeforeMaximize`: Stores {x, y} position before maximizing.
  const [normalPositionBeforeMaximize, setNormalPositionBeforeMaximize] = useState({ x: 0, y: 0 });
  // `positionBeforeMinimize`: Stores {x, y} position before minimizing.
  const [positionBeforeMinimize, setPositionBeforeMinimize] = useState({ x: 0, y: 0 });
  // `sizeBeforeMinimize`: Stores {width, height} before minimizing.
  const [sizeBeforeMinimize, setSizeBeforeMinimize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // This effect initializes the terminal window's size and position based on its parent container.
    // It only runs if the window hasn't been dragged yet and is in 'normal' state.
    // This allows the window to initially fill its container or adopt a default size/position.
    if (terminalWindowRef.current && terminalWindowRef.current.parentElement && !hasBeenDragged && windowState === 'normal') {
      const parentRect = terminalWindowRef.current.parentElement.getBoundingClientRect();
      const newSize = { width: parentRect.width, height: parentRect.height };
      
      // Initialize various size/position states if they haven't been set yet
      if (initialSize.width === 0) setInitialSize(newSize);
      if (normalSizeBeforeMaximize.width === 0) setNormalSizeBeforeMaximize(newSize);
      if (sizeBeforeMinimize.width === 0) setSizeBeforeMinimize(newSize);
      
      const newPosition = { x: parentRect.left, y: parentRect.top };
      if (position.x === 0 && position.y === 0) setPosition(newPosition);
      if (normalPositionBeforeMaximize.x === 0 && normalPositionBeforeMaximize.y === 0) setNormalPositionBeforeMaximize(newPosition);
      if (positionBeforeMinimize.x === 0 && positionBeforeMinimize.y === 0) setPositionBeforeMinimize(newPosition);
    }
  }, [hasBeenDragged, windowState, initialSize, normalSizeBeforeMaximize, position, normalPositionBeforeMaximize, sizeBeforeMinimize, positionBeforeMinimize]);

  // --- Window Drag Handlers ---
  const handleMouseDown = (e) => {
    // Only allow dragging with the primary mouse button and if window is not maximized/minimized.
    if (e.button !== 0 || windowState === 'maximized' || windowState === 'minimized') return;
    setIsDragging(true);
    
    // If this is the first drag, capture initial size/position relative to parent or current state.
    // This ensures subsequent drags use a consistent base size.
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

  // Effect to add/remove global mouse listeners for dragging.
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    // Cleanup: remove listeners when component unmounts or isDragging changes.
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // --- Window Control Button Handlers ---
  const handleCloseButtonClick = (e) => {
    e.stopPropagation(); // Prevent title bar's onMouseDown from firing.
    onClose?.(); // Call the provided onClose prop.
    // Reset all window state to default for next open.
    setWindowState('normal'); 
    setHasBeenDragged(false);
    setPosition({ x: 0, y: 0 }); 
    setInitialSize({ width: 0, height: 0 });
    setNormalSizeBeforeMaximize({ width: 0, height: 0 });
    setNormalPositionBeforeMaximize({ x: 0, y: 0 });
    setSizeBeforeMinimize({width: 0, height: 0});
    setPositionBeforeMinimize({x: 0, y: 0});

    // Dispose Xterm instance and its listeners if they exist.
    if (termInstanceRef.current) {
      termInstanceRef.current.dispose();
      termInstanceRef.current = null;
      if (keyListenerRef.current) { keyListenerRef.current.dispose(); keyListenerRef.current = null; }
      if (dataListenerRef.current) { dataListenerRef.current.dispose(); dataListenerRef.current = null; }
    }
  };

  const handleMinimizeButtonClick = (e) => {
    e.stopPropagation();
    const currentRect = terminalWindowRef.current.getBoundingClientRect();

    if (windowState === 'minimized') { // If already minimized, restore to normal.
      setWindowState('normal');
      setPosition(positionBeforeMinimize); // Restore to position before minimize.
      // Use double requestAnimationFrame to ensure DOM is updated before fitting.
      // This helps xterm's FitAddon calculate dimensions correctly after a state change.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fitAddonInstanceRef.current?.fit();
        });
      });
    } else { // If normal or maximized, minimize.
      // Store current size/position to restore from minimize state later.
      if (windowState === 'normal') {
        setPositionBeforeMinimize({ x: currentRect.left, y: currentRect.top });
        setSizeBeforeMinimize({ width: currentRect.width, height: currentRect.height });
      } else if (windowState === 'maximized') { // If maximized, store the "normal" state before maximize.
        setPositionBeforeMinimize(normalPositionBeforeMaximize);
        setSizeBeforeMinimize(normalSizeBeforeMaximize);
      }
      setWindowState('minimized');
    }
  };

  const handleMaximizeButtonClick = (e) => {
    e.stopPropagation();

    if (windowState === 'maximized') { // If already maximized, restore to normal.
      setWindowState('normal');
      setPosition(normalPositionBeforeMaximize); // Restore to position/size before maximize.
      // Double requestAnimationFrame for FitAddon, similar to minimize.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fitAddonInstanceRef.current?.fit();
        });
      });
    } else { // If normal or minimized, maximize.
      const currentRect = terminalWindowRef.current.getBoundingClientRect();
      // Store current size/position to restore from maximized state later.
      if (windowState === 'normal') {
        setNormalPositionBeforeMaximize({ x: currentRect.left, y: currentRect.top });
        setNormalSizeBeforeMaximize({ width: currentRect.width, height: currentRect.height });
      } else if (windowState === 'minimized') { // If minimized, use the pre-minimize state.
        setNormalPositionBeforeMaximize(positionBeforeMinimize);
        setNormalSizeBeforeMaximize(sizeBeforeMinimize);
      }
      setWindowState('maximized');
      // Double requestAnimationFrame for FitAddon.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fitAddonInstanceRef.current?.fit();
        });
      });
    }
  };

  // --- Main useEffect for Xterm.js Initialization and Auto-Commands ---
  useEffect(() => {
    let term; // Holds the Xterm instance for this effect scope.
    let currentCommand = ''; // Stores the command being typed by the user.
    let currentPath = 'C:\\'; // Manages the current directory path within the terminal.
    let processingAutoCommand = false; // Flag to prevent user input during auto-command execution.
    let autoCommandTimerId = null; // Stores ID of setTimeout for auto-commands, for cleanup.

    // --- Consolidated Command Execution Function ---
    // Processes a given command string, updates terminal output, and manages path changes.
    // `isAutoCmd` flag differentiates between user-entered commands and automated startup commands.
    const executeCommand = (commandString, termInstance, path, isAutoCmd = false) => {
      const [cmd, ...args] = commandString.trim().split(/\s+/); // Parse command and arguments.
      const processedCmd = cmd.toLowerCase(); // Normalize command to lowercase.
      let newPath = path; // Initialize newPath with current path; 'cd' will modify this.

      // --- Command Implementations ---
      if (processedCmd === 'about') {
        if (!isAutoCmd) { // User command: navigate and close terminal.
          termInstance.writeln('Navigating to C:\\ABOUT...');
          navigate('/about');
          onClose?.();
        } else { // Auto command: skip navigation.
          termInstance.writeln('Skipping navigation for auto-command: about');
        }
      } else if (processedCmd === 'projects') {
        if (!isAutoCmd) { // User command: navigate and close.
          termInstance.writeln('Navigating to C:\\PROJECTS...');
          navigate('/projects');
          onClose?.();
        } else { // Auto command: skip.
          termInstance.writeln('Skipping navigation for auto-command: projects');
        }
      } else if (processedCmd === 'exit') {
        if (!isAutoCmd) { // User command: close terminal.
          termInstance.writeln('Closing terminal interface...');
          onClose?.();
        } else { // Auto command: skip.
           termInstance.writeln('Skipping exit for auto-command: exit');
        }
      } else if (processedCmd === 'help') { // Display help message.
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
            const childrenContainer = dirToList.children || dirToList; // Handles C: root vs subdirs
            const keysToList = Object.keys(childrenContainer).filter(k => k !== 'type' && k !== 'date' && k !== 'time' && k !== 'children');

            // Special handling for '.' and '..' in subdirectories
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
            termInstance.writeln(` ${padLeft(totalDirs, 7)} dir(s)  ${padLeft((512 * 1024 * 1024).toLocaleString(), 12)} bytes free`); // Example free space
        } else { termInstance.writeln('Invalid path for DIR.'); }
      } else if (processedCmd === 'cd') {
        const targetDirRaw = args.join(' ').trim();
        if (!targetDirRaw) { termInstance.writeln(path.toUpperCase()); }
        else {
            const targetDir = targetDirRaw.toUpperCase(); let potentialNewPath;
            if (targetDir === '..') {
                const parts = path.toUpperCase().split('\\').filter(p => p && p !== 'C:');
                if (parts.length > 0) parts.pop();
                potentialNewPath = 'C:\\' + parts.join('\\');
                if (parts.length > 0) potentialNewPath += '\\';
            } else if (targetDir.startsWith('C:\\')) {
                potentialNewPath = targetDir;
                if (!potentialNewPath.endsWith('\\') && potentialNewPath.toUpperCase() !== 'C:') potentialNewPath += '\\';
            } else {
                const basePath = path.toUpperCase() === 'C:\\' ? path : (path.endsWith('\\') ? path : path + '\\');
                potentialNewPath = basePath + targetDir;
                if (!potentialNewPath.endsWith('\\')) potentialNewPath += '\\';
            }
            if (potentialNewPath.toUpperCase() === 'C:') potentialNewPath = 'C:\\'; // Normalize C:
            
            const entry = getFileSystemEntry(potentialNewPath, fileSystem);
            if (entry && entry.type === 'directory') { newPath = potentialNewPath.toUpperCase(); }
            else { termInstance.writeln('Invalid directory'); }
        }
      } else if (processedCmd === 'type') {
        const fileName = args.join(' ').trim().toUpperCase();
        if (!fileName) { termInstance.writeln('Usage: TYPE <filename>'); }
        else {
            const currentDirEntry = getFileSystemEntry(path, fileSystem);
            let fileEntry = null;
            // Check in children if currentDirEntry is a directory with children, or directly if it's the root C:
            const childrenSource = currentDirEntry?.children || (currentDirEntry === fileSystem['C:'] ? fileSystem['C:'] : null);

            if (currentDirEntry && currentDirEntry.type === 'directory' && childrenSource) {
                 fileEntry = childrenSource[fileName];
            }

            if (fileEntry && fileEntry.type === 'file') { fileEntry.content.split('\n').forEach(line => termInstance.writeln(line)); }
            else if (fileEntry && fileEntry.type === 'directory') { termInstance.writeln(`Access denied - ${fileName} is a directory.`); }
            else { termInstance.writeln(`File not found - ${fileName}`); }
        }
      } else if (processedCmd !== '') {
        termInstance.writeln(`Bad command or file name: ${processedCmd}`);
      }
      return newPath; // Return the new path (updated if 'cd' was successful).
    };

    // --- Xterm Initialization and Auto-Command Sequence ---
    // This block runs only if the divRef is available and no terminal instance exists yet.
    if (divRef.current && !termInstanceRef.current) {
      const newFitAddon = new FitAddon(); // Addon for fitting terminal to container size.
      fitAddonInstanceRef.current = newFitAddon;

      // Create a new Xterm.js Terminal instance.
      term = new Terminal({
        cursorBlink: true, // Enable cursor blinking.
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
      termInstanceRef.current = term; // Store the instance in a ref for access outside this effect.

      try {
        term.open(divRef.current); // Mount Xterm to the designated div.
        term.loadAddon(newFitAddon); // Load the FitAddon.

        // --- Auto-Command Execution Sequence (simulates boot-up activity) ---
        // Wrapped in setTimeout to allow Xterm to render first.
        autoCommandTimerId = setTimeout(async () => {
          try {
            // Safety check: ensure this terminal instance is still the active one.
            if (!termInstanceRef.current || termInstanceRef.current !== term) {
                return; // Stale timeout, do nothing.
            }
            newFitAddon.fit(); // Fit terminal to container size.
            term.writeln("WEYLAND CORP (c) More human than human");
            term.writeln("MS-DOS Version 6.22");
            term.writeln("");

            processingAutoCommand = true; // Disable user input during auto-commands.
            term.focus(); // Focus the terminal.

            // Select a random number of auto-commands to run.
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
            
            // Execute selected auto-commands sequentially with delays.
            // `autoCommandPath` is used here to manage path changes specifically for this sequence,
            // though in the current `executeCommand`, `cd` for auto-commands doesn't change `currentPath` for the main scope.
            // let autoCommandPath = currentPath; // This was how it was, but currentPath is updated directly now.

            for (const autoCmdObj of commandsToRun) {
              const commandString = `${autoCmdObj.cmd} ${autoCmdObj.args.join(' ')}`.trim();
              term.write(`\r\n${currentPath.toUpperCase()}> ${commandString}`); // Simulate typing the command.
              await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400)); // Delay.
              term.writeln(''); // Newline for command output.
              // Process the command; `isAutoCmd = true` prevents navigation/exit.
              currentPath = executeCommand(commandString, term, currentPath, true);
              await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500)); // Delay.
            }

            processingAutoCommand = false; // Re-enable user input.
            term.writeln("\nType 'help' for a list of available commands.");
            updatePrompt(); // Display the command prompt.

            // --- Setup User Input Event Listeners ---
            // Dispose any existing listeners before attaching new ones (important for HMR).
            keyListenerRef.current?.dispose();
            dataListenerRef.current?.dispose();

            // Handle key events (Enter, Backspace).
            keyListenerRef.current = term.onKey(e => {
              if (processingAutoCommand) return; // Ignore input if auto-commands are running.
              const { domEvent } = e;
              if (domEvent.key === 'Enter') {
                term.writeln(''); // Newline after user presses Enter.
                const commandToProcess = currentCommand;
                currentCommand = ''; // Reset current command buffer.
                
                // Execute the user's command; `isAutoCmd = false`.
                const newPath = executeCommand(commandToProcess, term, currentPath, false);
                currentPath = newPath; // Update current path if 'cd' was successful.

                // Only show a new prompt if the command didn't close/navigate away.
                const [cmdName] = commandToProcess.trim().toLowerCase().split(/\s+/);
                if (cmdName !== 'about' && cmdName !== 'projects' && cmdName !== 'exit') {
                    updatePrompt();
                }
              } else if (domEvent.key === 'Backspace') {
                if (processingAutoCommand) return;
                // Handle Backspace: remove last character from command buffer and terminal.
                if (currentPath && currentCommand.length > 0 && term.buffer.normal.cursorX > currentPath.length + 2) { // +2 for '> ' prompt
                    domEvent.preventDefault(); 
                    term.write('\b \b'); // Erase character on screen.
                    currentCommand = currentCommand.slice(0, -1); // Update command buffer.
                } else { 
                    domEvent.preventDefault(); // Prevent other backspace behavior.
                }
              }
            });

            // Handle incoming data (typed characters).
            dataListenerRef.current = term.onData(data => {
              if (processingAutoCommand) return;
              // Filter out escape sequences, Enter, Backspace (handled by onKey).
              if (data.startsWith('\x1b')) { return; } 
              if (data === '\r' || data === '\n' || data === '\r\n') { return; } 
              if (data.charCodeAt(0) === 127 || data === '\b') { return; } 
              currentCommand += data; // Append typed character to command buffer.
              term.write(data); // Echo character to terminal.
            });

            term.focus(); // Ensure terminal is focused after setup.

            // Helper to display the command prompt.
            const updatePrompt = () => {
              const promptText = `\r\n${currentPath.toUpperCase()}> `;
              term.write(promptText);
            };

          } catch (fitError) {
            console.error("[DosTerminal] Error during initial fit/write/auto-commands:", fitError);
          }
        }, 50); // Small delay (50ms) for Xterm to initialize before auto-commands.

      } catch (initError) {
        console.error("[DosTerminal] Error during direct xterm initialization:", initError);
        termInstanceRef.current = null; // Ensure ref is null if init failed.
      }
    }

    // --- Cleanup Function for useEffect ---
    // This runs when the component unmounts or dependencies (navigate, onClose) change.
    return () => {
      if (autoCommandTimerId) { // Clear any pending auto-command timeout.
        clearTimeout(autoCommandTimerId);
      }
      // Dispose Xterm event listeners.
      keyListenerRef.current?.dispose(); keyListenerRef.current = null;
      dataListenerRef.current?.dispose(); dataListenerRef.current = null;
      // Dispose the Xterm instance itself.
      if (termInstanceRef.current) {
          termInstanceRef.current.dispose();
          termInstanceRef.current = null;
      }
    };
  }, [navigate, onClose]); // Dependencies: effect re-runs if these change.

  // --- Handler to focus terminal on click/tap on its content area ---
  const handleTerminalContentClick = () => {
    if (termInstanceRef.current) { // If terminal instance exists
      termInstanceRef.current.focus(); // Focus it
    }
  };

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
     contentStyle = { height: `calc(${initialSize.height}px - 25px)`, width: '100%' }; // Adjust content height
  } else if (windowState === 'maximized') {
    windowStyle = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: 1001, // Ensure it's above other content when maximized
    };
     contentStyle = { height: 'calc(100vh - 25px)', width: '100%' }; // Adjust content height
  } else if (windowState === 'minimized') {
    windowStyle = {
      position: 'fixed', // Keep it fixed for minimized state
      left: hasBeenDragged ? `${positionBeforeMinimize.x}px` : 'auto',
      top: hasBeenDragged ? `${positionBeforeMinimize.y}px` : 'auto',
      right: !hasBeenDragged ? '20px' : 'auto',
      bottom: !hasBeenDragged ? '20px' : 'auto', // Default position if not dragged
      width: hasBeenDragged ? `${sizeBeforeMinimize.width * 0.3}px` : '200px', // Smaller width when minimized
      height: '25px', // Title bar height
      overflow: 'hidden', // Hide content when minimized
      zIndex: 1000,
    };
    // No contentStyle adjustment needed for minimized as content is hidden or irrelevant
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