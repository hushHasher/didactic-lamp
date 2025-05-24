import { useState, useCallback } from 'react';
import WindowManager from './WindowManager';
import DosTerminal from '../DosTerminal';
import {
  MSDOSIcon,
  NortonCommanderIcon,
  WinRARIcon,
  SystemToolsIcon,
  DefragIcon,
  CharMapIcon,
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
      id: 'nortoncommander',
      name: 'Norton Commander',
      icon: <NortonCommanderIcon size={32} />,
      position: { x: 20, y: 180 },
      action: () => openNortonCommanderWindow(),
    },
    {
      id: 'filemanager',
      name: 'File Manager',
      icon: <FileManagerIcon size={32} />,
      position: { x: 20, y: 260 },
      action: () => openFileManager(),
    },
    {
      id: 'programmanager',
      name: 'Program Manager',
      icon: <ProgramManagerIcon size={32} />,
      position: { x: 20, y: 340 },
      action: () => openProgramManager(),
    },
    {
      id: 'winrar',
      name: 'WinRAR',
      icon: <WinRARIcon size={32} />,
      position: { x: 20, y: 420 },
      action: () => openWinRARWindow(),
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
      id: 'charmap',
      name: 'Character Map',
      icon: <CharMapIcon size={32} />,
      position: { x: 120, y: 260 },
      action: () => openCharMapWindow(),
    },
    {
      id: 'solitaire',
      name: 'Solitaire',
      icon: <SolitaireIcon size={32} />,
      position: { x: 120, y: 340 },
      action: () => openSolitaireWindow(),
    },
    {
      id: 'soundrecorder',
      name: 'Sound Recorder',
      icon: <SoundRecorderIcon size={32} />,
      position: { x: 120, y: 420 },
      action: () => openSoundRecorderWindow(),
    },
    {
      id: 'systemtools',
      name: 'System Tools',
      icon: <SystemToolsIcon size={32} />,
      position: { x: 220, y: 20 },
      action: () => openSystemToolsWindow(),
    },
    {
      id: 'defrag',
      name: 'Defragmenter',
      icon: <DefragIcon size={32} />,
      position: { x: 220, y: 100 },
      action: () => openDefragWindow(),
    },
    {
      id: 'mediaplayer',
      name: 'Media Player',
      icon: <MediaPlayerIcon size={32} />,
      position: { x: 220, y: 180 },
      action: () => openMediaPlayerWindow(),
    },
    {
      id: 'controlpanel',
      name: 'Control Panel',
      icon: <ControlPanelIcon size={32} />,
      position: { x: 220, y: 260 },
      action: () => openControlPanelWindow(),
    },
    {
      id: 'network',
      name: 'Network',
      icon: <NetworkIcon size={32} />,
      position: { x: 220, y: 340 },
      action: () => openNetworkWindow(),
    },
    {
      id: 'recyclebin',
      name: 'Recycle Bin',
      icon: <RecycleBinIcon size={32} isEmpty={true} />,
      position: { x: 220, y: 420 },
      action: () => openRecycleBinWindow(),
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: <ApplicationIcon size={32} color="#8080ff">📁</ApplicationIcon>,
      position: { x: 320, y: 20 },
      action: () => openProjectsWindow(),
    },
    {
      id: 'about',
      name: 'About',
      icon: <ApplicationIcon size={32} color="#008080">ℹ</ApplicationIcon>,
      position: { x: 320, y: 100 },
      action: () => openAboutWindow(),
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

  const openNortonCommanderWindow = useCallback(() => {
    const id = generateWindowId();
    const leftFiles = [
      { name: 'AUTOEXEC.BAT', size: '128', type: 'file' },
      { name: 'CONFIG.SYS', size: '96', type: 'file' },
      { name: 'DOS', size: '<DIR>', type: 'dir' },
      { name: 'WINDOWS', size: '<DIR>', type: 'dir' },
      { name: 'PROJECTS', size: '<DIR>', type: 'dir' },
    ];
    const rightFiles = [
      { name: 'COMMAND.COM', size: '54649', type: 'file' },
      { name: 'MOUSE.COM', size: '15230', type: 'file' },
      { name: 'WELCOME.TXT', size: '150', type: 'file' },
      { name: 'README.MD', size: '80', type: 'file' },
    ];

    const newWindow = {
      id,
      title: 'Norton Commander',
      icon: <NortonCommanderIcon size={16} />,
      position: { x: 80 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 640, height: 480 },
      minSize: { width: 500, height: 350 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '4px', height: '100%', fontFamily: 'monospace', fontSize: '12px' }}>
            {/* Header */}
            <div style={{ display: 'flex', backgroundColor: '#000080', color: '#ffffff', padding: '2px 4px', marginBottom: '4px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>Left   C:\</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Right  C:\</div>
            </div>
            
            {/* File panels */}
            <div style={{ display: 'flex', height: 'calc(100% - 80px)' }}>
              {/* Left panel */}
              <div style={{ flex: 1, marginRight: '2px', border: '1px solid #000000', backgroundColor: '#ffff00' }}>
                <div style={{ backgroundColor: '#000080', color: '#ffffff', padding: '2px 4px', textAlign: 'center' }}>
                  C:\
                </div>
                <div style={{ padding: '2px', height: 'calc(100% - 24px)', overflow: 'auto' }}>
                  {leftFiles.map((file, index) => (
                    <div key={index} style={{ 
                      padding: '1px 2px', 
                      cursor: 'pointer',
                      backgroundColor: index === 0 ? '#0000ff' : 'transparent',
                      color: index === 0 ? '#ffffff' : '#000000'
                    }}>
                      {file.name.padEnd(12)} {file.size.padStart(8)}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right panel */}
              <div style={{ flex: 1, marginLeft: '2px', border: '1px solid #000000', backgroundColor: '#ffff00' }}>
                <div style={{ backgroundColor: '#008080', color: '#ffffff', padding: '2px 4px', textAlign: 'center' }}>
                  C:\
                </div>
                <div style={{ padding: '2px', height: 'calc(100% - 24px)', overflow: 'auto' }}>
                  {rightFiles.map((file, index) => (
                    <div key={index} style={{ 
                      padding: '1px 2px', 
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      color: '#000000'
                    }}>
                      {file.name.padEnd(12)} {file.size.padStart(8)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Function keys bar */}
            <div style={{ display: 'flex', marginTop: '4px', backgroundColor: '#008080', color: '#ffffff' }}>
              {['F1Help', 'F2Menu', 'F3View', 'F4Edit', 'F5Copy', 'F6Move', 'F7MkDir', 'F8Delete', 'F9PullDn', 'F10Quit'].map((key, index) => (
                <div key={index} style={{ 
                  flex: 1, 
                  padding: '2px', 
                  textAlign: 'center', 
                  borderRight: index < 9 ? '1px solid #ffffff' : 'none',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}>
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openWinRARWindow = useCallback(() => {
    const id = generateWindowId();
    const archives = [
      { name: 'BACKUP.RAR', size: '2.1 MB', date: '12-15-95', ratio: '87%' },
      { name: 'PROJECTS.ZIP', size: '4.3 MB', date: '11-20-95', ratio: '92%' },
      { name: 'SYSTEM.ARJ', size: '1.8 MB', date: '10-05-95', ratio: '89%' },
    ];

    const newWindow = {
      id,
      title: 'WinRAR',
      icon: <WinRARIcon size={16} />,
      position: { x: 150 + windows.length * 30, y: 120 + windows.length * 30 },
      size: { width: 500, height: 400 },
      minSize: { width: 400, height: 300 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '8px' }}>
            {/* Toolbar */}
            <div style={{ marginBottom: '8px', display: 'flex', gap: '4px' }}>
              {['📁', '📂', '📄', '➕', '✂️', '📋', '🔍'].map((icon, index) => (
                <button key={index} style={{
                  padding: '4px 8px',
                  border: '2px outset #c0c0c0',
                  backgroundColor: '#c0c0c0',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  {icon}
                </button>
              ))}
            </div>
            
            <h3 style={{ margin: '0 0 12px 0', color: '#000080' }}>Archive Manager</h3>
            
            {/* Archive list */}
            <div style={{ backgroundColor: 'white', border: '2px inset #c0c0c0', padding: '4px', minHeight: '200px' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#c0c0c0' }}>
                    <th style={{ textAlign: 'left', padding: '4px', borderRight: '1px solid #808080' }}>Archive</th>
                    <th style={{ textAlign: 'left', padding: '4px', borderRight: '1px solid #808080' }}>Size</th>
                    <th style={{ textAlign: 'left', padding: '4px', borderRight: '1px solid #808080' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '4px' }}>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {archives.map((archive, index) => (
                    <tr key={index} style={{ cursor: 'pointer' }}>
                      <td style={{ padding: '2px 4px', borderRight: '1px solid #e0e0e0' }}>
                        <span style={{ marginRight: '4px' }}>📦</span>
                        {archive.name}
                      </td>
                      <td style={{ padding: '2px 4px', borderRight: '1px solid #e0e0e0' }}>{archive.size}</td>
                      <td style={{ padding: '2px 4px', borderRight: '1px solid #e0e0e0' }}>{archive.date}</td>
                      <td style={{ padding: '2px 4px' }}>{archive.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {archives.length === 0 && (
                <div style={{ textAlign: 'center', color: '#606060', padding: '40px' }}>
                  No archives found
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#606060' }}>
              {archives.length} archive(s) | Total: 8.2 MB
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openSystemToolsWindow = useCallback(() => {
    const id = generateWindowId();
    const systemTools = [
      { name: 'Disk Defragmenter', icon: '🔧', desc: 'Optimize disk performance' },
      { name: 'ScanDisk', icon: '🔍', desc: 'Check disk for errors' },
      { name: 'System Monitor', icon: '📊', desc: 'Monitor system resources' },
      { name: 'Memory Manager', icon: '🧠', desc: 'Optimize memory usage' },
      { name: 'Registry Editor', icon: '📝', desc: 'Edit system registry' },
      { name: 'Device Manager', icon: '🔌', desc: 'Manage hardware devices' },
    ];

    const newWindow = {
      id,
      title: 'System Tools',
      icon: <SystemToolsIcon size={16} />,
      position: { x: 180 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 450, height: 400 },
      minSize: { width: 350, height: 300 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#000080' }}>System Tools</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {systemTools.map((tool, index) => (
                <div key={index} style={{
                  border: '2px outset #c0c0c0',
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#c0c0c0',
                  ':hover': { backgroundColor: '#e0e0e0' }
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{tool.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>{tool.name}</div>
                  <div style={{ fontSize: '10px', color: '#606060' }}>{tool.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openDefragWindow = useCallback(() => {
    const id = generateWindowId();
    const newWindow = {
      id,
      title: 'Disk Defragmenter',
      icon: <DefragIcon size={16} />,
      position: { x: 200 + windows.length * 30, y: 140 + windows.length * 30 },
      size: { width: 500, height: 350 },
      minSize: { width: 400, height: 250 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#000080' }}>Disk Defragmenter</h3>
            
            {/* Drive selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Drive:</label>
              <select style={{ padding: '2px', border: '1px inset #c0c0c0' }}>
                <option>C: [WEYLAND_OS]</option>
                <option>D: [CD-ROM]</option>
              </select>
            </div>
            
            {/* Fragmentation map */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Disk Map:</div>
              <div style={{ 
                border: '2px inset #c0c0c0', 
                padding: '8px', 
                backgroundColor: 'white',
                height: '100px',
                display: 'grid',
                gridTemplateColumns: 'repeat(20, 1fr)',
                gap: '1px'
              }}>
                {Array.from({length: 400}, (_, i) => (
                  <div key={i} style={{
                    width: '3px',
                    height: '3px',
                    backgroundColor: i % 7 === 0 ? '#ff0000' : i % 5 === 0 ? '#ffff00' : '#00ff00'
                  }} />
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div style={{ marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div><span style={{ color: '#00ff00' }}>█</span> Used clusters</div>
                <div><span style={{ color: '#ffff00' }}>█</span> Free space</div>
                <div><span style={{ color: '#ff0000' }}>█</span> Fragmented files</div>
              </div>
            </div>
            
            {/* Statistics */}
            <div style={{ backgroundColor: '#f0f0f0', border: '1px inset #c0c0c0', padding: '8px', fontSize: '12px' }}>
              <div>Disk capacity: 2.1 GB</div>
              <div>Free space: 1.2 GB (57%)</div>
              <div>Fragmentation level: 23%</div>
            </div>
            
            {/* Buttons */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button style={{
                padding: '6px 16px',
                margin: '0 4px',
                border: '2px outset #c0c0c0',
                backgroundColor: '#c0c0c0',
                cursor: 'pointer'
              }}>
                Analyze
              </button>
              <button style={{
                padding: '6px 16px',
                margin: '0 4px',
                border: '2px outset #c0c0c0',
                backgroundColor: '#c0c0c0',
                cursor: 'pointer'
              }}>
                Defragment
              </button>
            </div>
          </div>
        </div>
      )
    };
    setWindows(prev => [...prev, newWindow]);
  }, [windows.length, generateWindowId]);

  const openCharMapWindow = useCallback(() => {
    const id = generateWindowId();
    const characters = Array.from({length: 256}, (_, i) => String.fromCharCode(i));
    
    const newWindow = {
      id,
      title: 'Character Map',
      icon: <CharMapIcon size={16} />,
      position: { x: 160 + windows.length * 30, y: 120 + windows.length * 30 },
      size: { width: 450, height: 400 },
      minSize: { width: 350, height: 300 },
      resizable: true,
      zIndex: 1000 + windows.length,
      content: (
        <div className="window-content">
          <div style={{ padding: '8px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#000080' }}>Character Map</h3>
            
            {/* Font selection */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Font:</label>
              <select style={{ padding: '2px', border: '1px inset #c0c0c0', marginRight: '16px' }}>
                <option>Arial</option>
                <option>Times New Roman</option>
                <option>Courier New</option>
                <option>Symbol</option>
                <option>Wingdings</option>
              </select>
            </div>
            
            {/* Character grid */}
            <div style={{ 
              border: '2px inset #c0c0c0', 
              backgroundColor: 'white', 
              padding: '4px',
              height: '200px',
              overflow: 'auto'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(16, 1fr)', 
                gap: '1px'
              }}>
                {characters.slice(32, 256).map((char, index) => (
                  <div key={index + 32} style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    backgroundColor: 'white'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0000ff'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected character info */}
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>Characters to copy:</div>
              <input type="text" style={{ 
                flex: 1, 
                padding: '4px', 
                border: '2px inset #c0c0c0',
                fontFamily: 'monospace'
              }} />
              <button style={{
                padding: '4px 12px',
                border: '2px outset #c0c0c0',
                backgroundColor: '#c0c0c0',
                cursor: 'pointer'
              }}>
                Copy
              </button>
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