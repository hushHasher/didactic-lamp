import { useState, useCallback } from 'react';
import WindowManager from './WindowManager';
import DosTerminal from '../DosTerminal';
import {
  MSDOSIcon,
  FileManagerIcon,
  MyComputerIcon,
  ProgramManagerIcon,
  SolitaireIcon,
  PaintIcon,
  CalculatorIcon,
  SoundRecorderIcon,
  MediaPlayerIcon,
  NetworkIcon,
  RecycleBinIcon,
  ControlPanelIcon,
  HardDiskIcon,
  NotepadIcon,
  ApplicationIcon
} from './RetroIcons';
import './Desktop.css';

function Desktop() {
  const [windows, setWindows] = useState([]);

  // Desktop icons configuration with Windows 3.1 style icons
  const desktopIcons = [
    {
      id: 'mycomputer',
      name: 'My Computer',
      icon: <MyComputerIcon size={32} />,
      position: { x: 20, y: 20 },
      action: () => openMyComputerWindow(),
    },
    {
      id: 'terminal',
      name: 'MS-DOS Prompt',
      icon: <MSDOSIcon size={32} />,
      position: { x: 20, y: 100 },
      action: () => openTerminal(),
    },
    {
      id: 'filemanager',
      name: 'File Manager',
      icon: <FileManagerIcon size={32} />,
      position: { x: 20, y: 180 },
      action: () => openFileManager(),
    },
    {
      id: 'programmanager',
      name: 'Program Manager',
      icon: <ProgramManagerIcon size={32} />,
      position: { x: 20, y: 260 },
      action: () => openProgramManager(),
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: <ApplicationIcon size={32} color="#8080ff">📁</ApplicationIcon>,
      position: { x: 20, y: 340 },
      action: () => openProjectsWindow(),
    },
    {
      id: 'about',
      name: 'About',
      icon: <ApplicationIcon size={32} color="#008080">ℹ</ApplicationIcon>,
      position: { x: 20, y: 420 },
      action: () => openAboutWindow(),
    },
    {
      id: 'notepad',
      name: 'Notepad',
      icon: <NotepadIcon size={32} />,
      position: { x: 120, y: 20 },
      action: () => openTextEditor(),
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <CalculatorIcon size={32} />,
      position: { x: 120, y: 100 },
      action: () => openCalculatorWindow(),
    },
    {
      id: 'paint',
      name: 'Paintbrush',
      icon: <PaintIcon size={32} />,
      position: { x: 120, y: 180 },
      action: () => openPaintWindow(),
    },
    {
      id: 'solitaire',
      name: 'Solitaire',
      icon: <SolitaireIcon size={32} />,
      position: { x: 120, y: 260 },
      action: () => openSolitaireWindow(),
    },
    {
      id: 'soundrecorder',
      name: 'Sound Recorder',
      icon: <SoundRecorderIcon size={32} />,
      position: { x: 120, y: 340 },
      action: () => openSoundRecorderWindow(),
    },
    {
      id: 'mediaplayer',
      name: 'Media Player',
      icon: <MediaPlayerIcon size={32} />,
      position: { x: 120, y: 420 },
      action: () => openMediaPlayerWindow(),
    },
    {
      id: 'controlpanel',
      name: 'Control Panel',
      icon: <ControlPanelIcon size={32} />,
      position: { x: 220, y: 20 },
      action: () => openControlPanelWindow(),
    },
    {
      id: 'network',
      name: 'Network',
      icon: <NetworkIcon size={32} />,
      position: { x: 220, y: 100 },
      action: () => openNetworkWindow(),
    },
    {
      id: 'recyclebin',
      name: 'Recycle Bin',
      icon: <RecycleBinIcon size={32} isEmpty={true} />,
      position: { x: 220, y: 180 },
      action: () => openRecycleBinWindow(),
    },
  ];

  const generateWindowId = useCallback(() => {
    return `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const closeWindow = useCallback((windowId) => {
    setWindows(prev => prev.filter(window => window.id !== windowId));
  }, []);

  const openTerminal = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'MS-DOS Prompt',
      icon: '💻',
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 700, height: 450 },
      minSize: { width: 400, height: 300 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: <DosTerminal onClose={() => closeWindow(id)} shouldFocusOnOpen={true} />
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId, closeWindow]);

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
            defaultValue="Welcome to Notepad for Weyland Corp OS 2025..."
            spellCheck={false}
          />
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openMyComputerWindow = useCallback(() => {
    const id = generateWindowId();
    const drives = [
      { name: 'Hard disk (C:)', icon: '🗂️', size: '2.1 GB', free: '1.2 GB' },
      { name: 'Floppy (A:)', icon: '💾', size: '1.44 MB', free: '1.44 MB' },
      { name: 'CD-ROM (D:)', icon: '💿', size: '650 MB', free: 'N/A' },
    ];

    const newWindow = {
      id,
      title: 'My Computer',
      icon: <MyComputerIcon size={16} />,
      position: { x: 120 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 400, height: 300 },
      minSize: { width: 300, height: 200 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content file-manager">
          <div style={{ padding: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#000080' }}>My Computer</h3>
            <div style={{ backgroundColor: 'white', border: '1px inset #c0c0c0', padding: '8px' }}>
              {drives.map((drive, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '4px', 
                  marginBottom: '4px',
                  cursor: 'pointer'
                }}>
                  <span style={{ marginRight: '8px', fontSize: '20px' }}>{drive.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{drive.name}</div>
                    <div style={{ fontSize: '11px', color: '#606060' }}>
                      Size: {drive.size} | Free: {drive.free}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openProgramManager = useCallback(() => {
    const id = generateWindowId();
    const programGroups = [
      { name: 'Accessories', icon: '🔧', programs: ['Calculator', 'Notepad', 'Paint'] },
      { name: 'Games', icon: '🎮', programs: ['Solitaire', 'Minesweeper'] },
      { name: 'System Tools', icon: '⚙️', programs: ['Control Panel', 'File Manager'] },
    ];

    const newWindow = {
      id,
      title: 'Program Manager',
      icon: <ProgramManagerIcon size={16} />,
      position: { x: 150 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 450, height: 350 },
      minSize: { width: 350, height: 250 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '8px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#000080' }}>Program Manager</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
              {programGroups.map((group, index) => (
                <div key={index} style={{
                  border: '2px outset #c0c0c0',
                  padding: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#c0c0c0'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '4px' }}>{group.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{group.name}</div>
                  <div style={{ fontSize: '10px', color: '#606060', marginTop: '2px' }}>
                    {group.programs.length} item(s)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openCalculatorWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Calculator',
      icon: <CalculatorIcon size={16} />,
      position: { x: 200 + windows.length * 30, y: 120 + windows.length * 30 },
      size: { width: 250, height: 300 },
      minSize: { width: 250, height: 300 },
      resizable: false,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '8px', fontFamily: 'monospace' }}>
            <div style={{ 
              backgroundColor: 'black', 
              color: '#00ff00', 
              padding: '8px', 
              marginBottom: '8px',
              textAlign: 'right',
              fontSize: '18px',
              border: '1px inset #c0c0c0'
            }}>
              0
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
              {['C', '±', '/', '*', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'].map((btn, i) => (
                <button key={i} style={{
                  padding: '8px',
                  border: '2px outset #c0c0c0',
                  backgroundColor: '#c0c0c0',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openPaintWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Paintbrush',
      icon: <PaintIcon size={16} />,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 600, height: 450 },
      minSize: { width: 400, height: 300 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '4px' }}>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <div style={{ marginRight: '8px' }}>
                {['🖌️', '✏️', '🖍️', '🔲', '⭕', '📏'].map((tool, i) => (
                  <button key={i} style={{
                    padding: '4px 8px',
                    margin: '2px',
                    border: '2px outset #c0c0c0',
                    backgroundColor: '#c0c0c0',
                    cursor: 'pointer'
                  }}>
                    {tool}
                  </button>
                ))}
              </div>
              <div>
                {['🔴', '🟢', '🔵', '🟡', '⚫', '⚪'].map((color, i) => (
                  <div key={i} style={{
                    width: '20px',
                    height: '20px',
                    margin: '2px',
                    border: '1px solid #000',
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}>
                    {color}
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              width: '100%',
              height: '300px',
              backgroundColor: 'white',
              border: '2px inset #c0c0c0',
              cursor: 'crosshair'
            }}>
              <div style={{ padding: '20px', color: '#808080' }}>
                Canvas area - Click and drag to paint
              </div>
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openSolitaireWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Solitaire',
      icon: <SolitaireIcon size={16} />,
      position: { x: 150 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 640, height: 480 },
      minSize: { width: 500, height: 400 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '8px', backgroundColor: '#008000', height: '100%' }}>
            <div style={{ color: 'white', textAlign: 'center', marginBottom: '16px' }}>
              <h3>Windows Solitaire</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', height: '200px' }}>
              {Array.from({length: 7}, (_, i) => (
                <div key={i} style={{
                  border: '2px solid #004000',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  {i === 0 && <div style={{ color: 'white', fontSize: '24px' }}>🂠</div>}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '16px', color: 'white' }}>
              Score: 0 | Time: 0:00
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openSoundRecorderWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Sound Recorder',
      icon: <SoundRecorderIcon size={16} />,
      position: { x: 300 + windows.length * 30, y: 150 + windows.length * 30 },
      size: { width: 350, height: 200 },
      minSize: { width: 300, height: 150 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                width: '200px',
                height: '40px',
                backgroundColor: 'black',
                border: '2px inset #c0c0c0',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00ff00',
                fontFamily: 'monospace'
              }}>
                00:00:00
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              {['⏹️', '▶️', '⏸️', '⏺️'].map((btn, i) => (
                <button key={i} style={{
                  padding: '8px 12px',
                  margin: '0 4px',
                  border: '2px outset #c0c0c0',
                  backgroundColor: '#c0c0c0',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>
                  {btn}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#606060' }}>
              Ready to record...
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openMediaPlayerWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Media Player',
      icon: <MediaPlayerIcon size={16} />,
      position: { x: 180 + windows.length * 30, y: 120 + windows.length * 30 },
      size: { width: 400, height: 300 },
      minSize: { width: 350, height: 250 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '8px' }}>
            <div style={{
              backgroundColor: 'black',
              height: '150px',
              border: '2px inset #c0c0c0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <div style={{ color: '#c0c0c0', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎵</div>
                <div>No media loaded</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              {['⏮️', '⏹️', '▶️', '⏸️', '⏭️'].map((btn, i) => (
                <button key={i} style={{
                  padding: '6px 10px',
                  margin: '0 2px',
                  border: '2px outset #c0c0c0',
                  backgroundColor: '#c0c0c0',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  {btn}
                </button>
              ))}
            </div>
            <div style={{ padding: '4px', fontSize: '12px', textAlign: 'center' }}>
              <div>Volume: ████████░░ 80%</div>
              <div>Position: 00:00 / 00:00</div>
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openControlPanelWindow = useCallback(() => {
    const id = generateWindowId();
    const controlPanelItems = [
      { name: 'Display', icon: '🖥️', desc: 'Change display settings' },
      { name: 'Mouse', icon: '🖱️', desc: 'Mouse configuration' },
      { name: 'Keyboard', icon: '⌨️', desc: 'Keyboard settings' },
      { name: 'Sound', icon: '🔊', desc: 'Audio configuration' },
      { name: 'System', icon: '⚙️', desc: 'System information' },
      { name: 'Network', icon: '🌐', desc: 'Network settings' },
    ];

    const newWindow = {
      id,
      title: 'Control Panel',
      icon: <ControlPanelIcon size={16} />,
      position: { x: 160 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 500, height: 400 },
      minSize: { width: 400, height: 300 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#000080' }}>Control Panel</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {controlPanelItems.map((item, index) => (
                <div key={index} style={{
                  border: '2px outset #c0c0c0',
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#c0c0c0',
                  ':hover': { backgroundColor: '#e0e0e0' }
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>{item.name}</div>
                  <div style={{ fontSize: '10px', color: '#606060' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openNetworkWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Network',
      icon: <NetworkIcon size={16} />,
      position: { x: 220 + windows.length * 30, y: 140 + windows.length * 30 },
      size: { width: 450, height: 350 },
      minSize: { width: 350, height: 250 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#000080' }}>Network Neighborhood</h3>
            <div style={{ border: '2px inset #c0c0c0', padding: '8px', backgroundColor: 'white', minHeight: '200px' }}>
              <div style={{ textAlign: 'center', color: '#606060', paddingTop: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌐</div>
                <div>No network computers found</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>
                  Make sure your network is properly configured
                </div>
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#606060' }}>
              Status: Not connected to network
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openRecycleBinWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Recycle Bin',
      icon: <RecycleBinIcon size={16} isEmpty={true} />,
      position: { x: 250 + windows.length * 30, y: 160 + windows.length * 30 },
      size: { width: 400, height: 300 },
      minSize: { width: 300, height: 200 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#000080' }}>Recycle Bin</h3>
            <div style={{ 
              border: '2px inset #c0c0c0', 
              padding: '32px', 
              backgroundColor: 'white', 
              textAlign: 'center',
              minHeight: '150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🗑️</div>
              <div style={{ color: '#606060' }}>Recycle Bin is empty</div>
              <div style={{ fontSize: '12px', color: '#808080', marginTop: '8px' }}>
                Drag files here to delete them
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#606060' }}>
              0 object(s) | 0 bytes
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const handleIconDoubleClick = useCallback((icon) => {
    icon.action();
  }, []);

  return (
    <div className="desktop">
      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <div
          key={icon.id}
          className="desktop-icon"
          style={{
            left: `${icon.position.x}px`,
            top: `${icon.position.y}px`,
          }}
          onDoubleClick={() => handleIconDoubleClick(icon)}
        >
          <div className="icon-image">{icon.icon}</div>
          <div className="icon-label">{icon.name}</div>
        </div>
      ))}

      {/* Window Manager */}
      <WindowManager windows={windows} onWindowsChange={setWindows} />
    </div>
  );
}

export default Desktop; 