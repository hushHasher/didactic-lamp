import { useState, useCallback } from 'react';import WindowManager from './WindowManager';import DosTerminal from '../DosTerminal';import './Desktop.css';function Desktop() {  const [windows, setWindows] = useState([]);

  // Desktop icons configuration
  const desktopIcons = [
    {
      id: 'terminal',
      name: 'DOS Terminal',
      icon: '💻',
      position: { x: 20, y: 20 },
      action: () => openTerminal(),
    },
    {
      id: 'about',
      name: 'About',
      icon: '📋',
      position: { x: 20, y: 100 },
      action: () => openAboutWindow(),
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: '📁',
      position: { x: 20, y: 180 },
      action: () => openProjectsWindow(),
    },
    {
      id: 'filemanager',
      name: 'File Manager',
      icon: '🗂️',
      position: { x: 20, y: 260 },
      action: () => openFileManager(),
    },
    {
      id: 'texteditor',
      name: 'Text Editor',
      icon: '📝',
      position: { x: 20, y: 340 },
      action: () => openTextEditor(),
    },
  ];

  const generateWindowId = useCallback(() => {
    return `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

    const openTerminal = useCallback(() => {    const id = generateWindowId();    const newWindow = {      id,      title: 'MS-DOS Prompt',      icon: '💻',      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },      size: { width: 700, height: 450 },      minSize: { width: 400, height: 300 },      resizable: true,      zIndex: 1000 + windows.length,      content: <DosTerminal onClose={() => closeWindow(id)} shouldFocusOnOpen={true} />    };    setWindows(prev => [...prev, newWindow]);  }, [windows.length, generateWindowId, closeWindow]);

  const openAboutWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'About - Weyland Corp',
      icon: '📋',
      position: { x: 150 + windows.length * 30, y: 150 + windows.length * 30 },
      size: { width: 600, height: 400 },
      minSize: { width: 400, height: 300 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '16px' }}>
            <h2 style={{ marginTop: 0, color: '#000080' }}>WEYLAND CORP - CONVERGENCE EVENT</h2>
            <div style={{ backgroundColor: '#000080', color: 'white', padding: '8px', marginBottom: '16px', fontFamily: 'monospace' }}>
              &gt; WILLOW_OS_2025: ANOMALOUS SIGNAL CLUSTER DETECTED...
            </div>
            <p>Neon rain streaks across digital skylines, reflecting in eyes that question their own reflection. Circuits hum with borrowed life, programs dream of users, and the line between the created and the creator dissolves into the phosphor glow.</p>
            <p>A relentless hunter's crimson gaze cuts through the static. "I'll be back," it whispers, a promise and a threat. Elsewhere, a desperate cry: "Game over, man!" as corporate directives override human survival, and steel flesh enforces a broken law.</p>
            <p>These are not just stories, but probability waves from what might have been, or what could yet be. This terminal acts as a junction, a place to observe these colliding dystopias and perhaps discern a different directive.</p>
            <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f0f0f0', border: '1px inset #c0c0c0' }}>
              <strong>System Status:</strong> NOMINAL<br/>
              <strong>Reality Matrix:</strong> STABLE<br/>
              <strong>Convergence Level:</strong> 87.3%
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openProjectsWindow = useCallback(() => {
    const id = generateWindowId();
    const retroProjects = [
      "NOVA-STRIKE Utilities Suite v2.1",
      "CYBERGLYPH Font Engine (Shareware)",
      "PIXELWEAVER Deluxe Paint Studio",
      "SOUNDWAVE MOD Tracker Gold",
      "NIGHTOWL BBS Door Kit",
      "HEXEDIT Pro 97",
      "NEURAL-NET Chess AI (Experimental)",
      "STARMAP Navigator v3.0 (Celestial DB)",
      "CODECRUNCH Packer/Unpacker",
      "VIRTUA-DESK Desktop Enhancer",
    ];

    const newWindow = {
      id,
      title: 'Projects Archive',
      icon: '📁',
      position: { x: 200 + windows.length * 30, y: 200 + windows.length * 30 },
      size: { width: 500, height: 400 },
      minSize: { width: 350, height: 250 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content file-manager">
          <div style={{ padding: '8px' }}>
            <div style={{ backgroundColor: '#000080', color: 'white', padding: '4px', marginBottom: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
              C:\ARCHIVES\PROJECTS_OLD&gt; DIR
            </div>
            <ul className="file-list">
              {retroProjects.map((project, index) => (
                <li key={index} className="file-item">
                  <span className="file-icon">📄</span>
                  <span>{project}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '16px', fontSize: '12px', color: '#606060' }}>
              {retroProjects.length} file(s) listed - Click items to select
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openFileManager = useCallback(() => {
    const id = generateWindowId();
    const files = [
      { name: 'AUTOEXEC.BAT', type: 'file', icon: '📄', size: '128 bytes' },
      { name: 'CONFIG.SYS', type: 'file', icon: '📄', size: '96 bytes' },
      { name: 'COMMAND.COM', type: 'file', icon: '⚙️', size: '54,649 bytes' },
      { name: 'DOS', type: 'directory', icon: '📁', size: '<DIR>' },
      { name: 'WINDOWS', type: 'directory', icon: '📁', size: '<DIR>' },
      { name: 'PROJECTS', type: 'directory', icon: '📁', size: '<DIR>' },
      { name: 'WELCOME.TXT', type: 'file', icon: '📄', size: '150 bytes' },
      { name: 'README.MD', type: 'file', icon: '📄', size: '80 bytes' },
    ];

    const newWindow = {
      id,
      title: 'File Manager - C:\\',
      icon: '🗂️',
      position: { x: 120 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 450, height: 350 },
      minSize: { width: 300, height: 200 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content file-manager">
          <div style={{ padding: '4px' }}>
            <div style={{ backgroundColor: '#c0c0c0', padding: '2px 4px', marginBottom: '4px', border: '1px inset #c0c0c0' }}>
              <strong>C:\</strong>
            </div>
            <div style={{ backgroundColor: 'white', border: '1px inset #c0c0c0', height: '250px', overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#c0c0c0' }}>
                    <th style={{ textAlign: 'left', padding: '2px 4px', borderRight: '1px solid #808080' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '2px 4px', borderRight: '1px solid #808080' }}>Size</th>
                    <th style={{ textAlign: 'left', padding: '2px 4px' }}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index} style={{ cursor: 'pointer' }} onMouseOver={(e) => e.target.parentElement.style.backgroundColor = '#0000ff'} onMouseOut={(e) => e.target.parentElement.style.backgroundColor = 'white'}>
                      <td style={{ padding: '1px 4px', borderRight: '1px solid #e0e0e0' }}>
                        <span style={{ marginRight: '4px' }}>{file.icon}</span>
                        {file.name}
                      </td>
                      <td style={{ padding: '1px 4px', borderRight: '1px solid #e0e0e0' }}>{file.size}</td>
                      <td style={{ padding: '1px 4px' }}>{file.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openTextEditor = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Untitled - Notepad',
      icon: '📝',
      position: { x: 80 + windows.length * 30, y: 60 + windows.length * 30 },
      size: { width: 500, height: 350 },
      minSize: { width: 300, height: 200 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content text-editor">
          <textarea 
            className="text-editor-content"
            placeholder="Welcome to the Weyland Corp Text Editor...&#10;&#10;Type your message here..."
            defaultValue="WEYLAND CORP SECURE TERMINAL&#10;Classification: RESTRICTED&#10;&#10;> Accessing neural network...&#10;> Loading personality matrix...&#10;> Initializing conversational protocols...&#10;&#10;System ready for user input.&#10;&#10;Remember: Building Better Worlds starts with better communication."
          />
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

    const closeWindow = useCallback((windowId) => {    setWindows(prev => prev.filter(w => w.id !== windowId));  }, []);

  const handleIconDoubleClick = useCallback((icon) => {
    icon.action();
  }, []);

  return (    <div className="desktop">      <WindowManager         windows={windows}         onWindowsChange={setWindows}      >        {/* Desktop Icons */}        <div className="desktop-icons">          {desktopIcons.map(icon => (            <div              key={icon.id}              className="desktop-icon"              style={{                left: icon.position.x,                top: icon.position.y,              }}              onDoubleClick={() => handleIconDoubleClick(icon)}            >              <div className="icon-image">{icon.icon}</div>              <div className="icon-label">{icon.name}</div>            </div>          ))}        </div>      </WindowManager>    </div>  );
}

export default Desktop; 