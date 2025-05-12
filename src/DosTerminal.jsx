// src/DosTerminal.jsx
import { useEffect, useRef } from 'react';
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
  const divRef = useRef(null); // Ref for the container div
  // Use refs to ensure terminal, addon, and listener instances are stable across renders/StrictMode
  const termInstanceRef = useRef(null);
  const fitAddonInstanceRef = useRef(null);
  const keyListenerRef = useRef(null); // Ref to hold the key listener disposable
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs when the DosTerminal component mounts
    console.log("DosTerminal useEffect running.");

    let term; // Declare term variable in the effect's scope

    // Only initialize if the div exists and we haven't initialized already
    if (divRef.current && !termInstanceRef.current) {
      console.log("DosTerminal: Initializing Terminal.");

      // Ensure FitAddon instance is created only once
      if (!fitAddonInstanceRef.current) {
          fitAddonInstanceRef.current = new FitAddon();
      }
      const fitAddon = fitAddonInstanceRef.current;

      // Create Terminal instance
      term = new Terminal({
        cursorBlink: true,
        cursorStyle: 'block',
        fontFamily: 'monospace', // Consider setting your desired DOS font here later
        theme: {
          background: '#0000AA', // Blue background
          foreground: '#FFFFFF', // White text
          cursor: '#FFFFFF',
          cursorAccent: '#0000AA'
        }
      });
      termInstanceRef.current = term; // Store instance in ref

      try {
        // Attach the terminal to the div element
        term.open(divRef.current);

        // Load the FitAddon
        term.loadAddon(fitAddon);

        // Use setTimeout to allow DOM render before fitting
        setTimeout(() => {
            try {
                console.log("DosTerminal: Fitting addon...");
                fitAddon.fit(); // Calculate and apply size
                console.log(`DosTerminal: Fit complete. Size: ${term.cols}x${term.rows}`);

                // Initialize these *before* first use for the prompt
                let currentCommand = '';
                let currentPath = 'C:\\'; 

                term.writeln("WEYLAND CORP (c) More human than human");
                term.writeln("[Version 443.0.4.293]");
                term.writeln("");
                term.writeln("Type 'help' for a list of available commands.");
                term.write(`${currentPath.toUpperCase()}> `); // Initial prompt with path

                const updatePrompt = () => {
                  term.write(`\r\n${currentPath.toUpperCase()}> `);
                };

                // Dispose previous listener if any (handles StrictMode potentially)
                keyListenerRef.current?.dispose();

                // Attach listener and store the disposable object in ref
                keyListenerRef.current = term.onKey(e => {
                  const { key, domEvent } = e;
                  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

                  if (domEvent.key === 'Enter') {
                     term.writeln(''); // Echo newline
                     const [command, ...args] = currentCommand.trim().split(/\s+/);
                     const processedCommand = command.toLowerCase();
                     // --- Process Commands ---
                     if (processedCommand === 'help') {
                       term.writeln('Available commands:');
                       term.writeln('  help          - Displays this help message.');
                       term.writeln('  about         - Navigates to the About section.');
                       term.writeln('  projects      - Navigates to the Projects section.');
                       // term.writeln('  contact       - Navigates to the Contact section.');
                       term.writeln('  dir           - Lists files and directories.');
                       term.writeln('  cd <dir>      - Changes current directory. Use "cd .." to go up.');
                       term.writeln('  type <file>   - Displays the content of a file.');
                       term.writeln('  clear         - Clears the terminal screen.');
                       term.writeln('  exit          - Closes the terminal interface.');
                     } else if (processedCommand === 'clear') {
                       term.clear();
                     } else if (processedCommand === 'exit') {
                       term.writeln('Closing terminal interface...');
                       props.onClose?.(); // Use the passed onClose prop
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
                            // Add parent directory ".."
                            if (currentPath.toUpperCase() !== 'C:\\') {
                                term.writeln(`  <DIR>         .`); // Current directory
                                term.writeln(`  <DIR>         ..`); // Parent directory
                                dirCount +=2;
                            }

                            Object.entries(entry.children).forEach(([name, item]) => {
                                if (item.type === 'directory') {
                                    term.writeln(`  <DIR>         ${name}`);
                                    dirCount++;
                                } else {
                                    term.writeln(`                ${name}`); // Basic alignment
                                    fileCount++;
                                }
                            });
                            term.writeln(`\r\n       ${fileCount} File(s)`);
                            term.writeln(`       ${dirCount} Dir(s)`);
                        } else {
                            term.writeln('Invalid path.');
                        }
                     } else if (processedCommand === 'cd') {
                        const targetDirRaw = args.join(' ').trim(); // Keep original case for display if needed, but process as upper
                        const targetDir = targetDirRaw.toUpperCase();

                        if (!targetDirRaw) { // Check raw for emptiness
                            term.writeln(currentPath.toUpperCase());
                        } else if (targetDir === '..') {
                            const parts = currentPath.toUpperCase().split('\\').filter(p => p && p !== 'C:'); // Handle C:\ better
                            if (parts.length > 0) {
                                parts.pop();
                                currentPath = 'C:\\' + parts.join('\\') + (parts.length > 0 ? '\\' : '');
                            } else { // Already at C:\ or malformed
                                currentPath = 'C:\\';
                            }
                        } else {
                            let newPath;
                            if (targetDir.startsWith('C:\\')) {
                                newPath = targetDir;
                            } else {
                                newPath = (currentPath.endsWith('\\') ? currentPath : currentPath + '\\') + targetDir;
                            }
                            // Ensure newPath ends with a backslash if it's not C:\
                            if (!newPath.endsWith('\\') && newPath.toUpperCase() !== 'C:') {
                                newPath += '\\';
                            } else if (newPath.toUpperCase() === 'C:') {
                                newPath = 'C:\\'; // Normalize C:
                            }

                            const entry = getFileSystemEntry(newPath, fileSystem);
                            if (entry && entry.type === 'directory') {
                                currentPath = newPath.toUpperCase(); // Store path in uppercase
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
                                    // Split content by newline and writeln each line
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
                     // --- End Command Processing ---
                     currentCommand = ''; // Reset command buffer
                     updatePrompt(); // Update prompt with new path if changed
                  } else if (domEvent.key === 'Backspace') {
                     // Ensure currentPath is defined and cursor is beyond the prompt
                     if (currentPath && currentCommand.length > 0 && term.buffer.normal.cursorX > currentPath.length + 2) {
                       domEvent.preventDefault();
                       term.write('\b \b');
                       currentCommand = currentCommand.slice(0, -1);
                     } else {
                       domEvent.preventDefault(); // Prevent deleting prompt
                     }
                  } else if (printable && key.length === 1) {
                     currentCommand += key;
                     term.write(key);
                  }
                });
                // --- End Input Handling ---

            } catch (fitError) {
                console.error("Error during fit/write:", fitError);
            }
        }, 0); // End setTimeout

      } catch (initError) {
        console.error("Error during direct xterm initialization:", initError);
        termInstanceRef.current = null; // Reset ref on error
      }
    }

    // Cleanup function: Runs when DosTerminal component unmounts
    return () => {
      console.log("DosTerminal cleanup: Disposing terminal and listener.");
      // Dispose listener
      keyListenerRef.current?.dispose();
      keyListenerRef.current = null;
      // Dispose terminal
      if (termInstanceRef.current) {
          termInstanceRef.current.dispose();
          termInstanceRef.current = null;
          console.log("Terminal instance disposed.");
      } else {
          console.log("No terminal instance found in ref to dispose.");
      }
    };

  }, [navigate, props.onClose]); // Added props.onClose

  // Render the div where the terminal will attach.
  // Style ensures it fills the container defined in App.css
  return (
    <div ref={divRef} style={{ height: '100%', width: '100%' }} />
  );
}

export default DosTerminal;