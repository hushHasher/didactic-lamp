// src/DosTerminal.jsx
import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

function DosTerminal() {
  const divRef = useRef(null); // Ref for the container div
  // Use refs to ensure terminal, addon, and listener instances are stable across renders/StrictMode
  const termInstanceRef = useRef(null);
  const fitAddonInstanceRef = useRef(null);
  const keyListenerRef = useRef(null); // Ref to hold the key listener disposable

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

                // Write initial content after fitting
                term.writeln("WEYLAND CORP [Version 443.0.4.293]");
                term.writeln("(c) Building Better Worlds");
                term.writeln("");
                term.write("C:\\> ");

                // --- Input Handling ---
                let currentCommand = '';
                // Dispose previous listener if any (handles StrictMode potentially)
                keyListenerRef.current?.dispose();

                // Attach listener and store the disposable object in ref
                keyListenerRef.current = term.onKey(e => {
                  const { key, domEvent } = e;
                  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

                  if (domEvent.key === 'Enter') {
                     term.writeln(''); // Echo newline
                     const trimmedCommand = currentCommand.trim();
                     // --- Process Commands ---
                     if (trimmedCommand === 'help') {
                       term.writeln('Available commands: help, clear, exit');
                       // Add other commands for 'about', 'projects', 'contact' later
                     } else if (trimmedCommand === 'clear') {
                       term.clear();
                     } else if (trimmedCommand === 'exit') {
                       term.writeln('Exiting terminal... (Close window or press button)');
                       // Ideally, trigger the toggle function in App.jsx via props
                     } else if (trimmedCommand !== '') { // If command not empty and not recognized
                       term.writeln(`Bad command or file name: ${trimmedCommand}`);
                     }
                     // --- End Command Processing ---
                     term.write("\r\nC:\\> "); // Write next prompt
                     currentCommand = ''; // Reset command buffer
                  } else if (domEvent.key === 'Backspace') {
                     // Handle backspace; prevent deleting prompt
                     if (term.buffer.normal.cursorX > 4) { // Check cursor position
                       term.write('\b \b'); // Erase char visually
                       if (currentCommand.length > 0) currentCommand = currentCommand.slice(0,-1); // Update buffer
                     }
                  } else if (printable && key.length === 1) {
                     // Handle printable characters
                     currentCommand += key;
                     term.write(key); // Echo character
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

  }, []); // Empty dependency array ensures this runs only once when component mounts

  // Render the div where the terminal will attach.
  // Style ensures it fills the container defined in App.css
  return (
    <div ref={divRef} style={{ height: '100%', width: '100%' }} />
  );
}

export default DosTerminal;