import React from 'react';
import { 
  FaFolder, 
  FaFile, 
  FaComputer, 
  FaCog, 
  FaCalculator,
  FaPaintBrush,
  FaGamepad,
  FaMusic,
  FaImage,
  FaNetworkWired,
  FaTrash,
  FaHdd,
  FaDesktop,
  FaFolderOpen
} from 'react-icons/fa';

// Custom Windows 3.1 style icon wrapper
const IconWrapper = ({ children, size = 32, style = {} }) => (
  <div 
    style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${size * 0.8}px`,
      imageRendering: 'pixelated',
      filter: 'contrast(1.2) brightness(1.1)',
      ...style
    }}
  >
    {children}
  </div>
);

// MS-DOS Terminal Icon
export const MSDOSIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, #000080, #000040)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontWeight: 'bold'
    }}>
      C:\&gt;
    </div>
  </IconWrapper>
);

// File Manager Icon
export const FileManagerIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <FaFolderOpen style={{ color: '#ffff80', filter: 'drop-shadow(1px 1px 2px #000080)' }} />
  </IconWrapper>
);

// My Computer Icon
export const MyComputerIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #c0c0c0, #808080)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <FaDesktop style={{ color: '#000080', fontSize: '20px' }} />
      <div style={{
        position: 'absolute',
        bottom: '2px',
        right: '2px',
        width: '8px',
        height: '6px',
        background: '#ff0000',
        border: '1px solid #800000'
      }} />
    </div>
  </IconWrapper>
);

// Program Manager Icon
export const ProgramManagerIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #008080, #004040)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        background: '#ffffff',
        border: '1px solid #000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold'
      }}>
        PM
      </div>
    </div>
  </IconWrapper>
);

// Solitaire Game Icon
export const SolitaireIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #008000, #004000)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Playing card representation */}
      <div style={{
        width: '18px',
        height: '24px',
        background: '#ffffff',
        border: '1px solid #000000',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#ff0000'
      }}>
        ♠
      </div>
    </div>
  </IconWrapper>
);

// Paint Icon
export const PaintIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #ffff80, #c0c000)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaPaintBrush style={{ color: '#800080', fontSize: '20px' }} />
    </div>
  </IconWrapper>
);

// Calculator Icon
export const CalculatorIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #c0c0c0, #808080)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaCalculator style={{ color: '#000080', fontSize: '20px' }} />
    </div>
  </IconWrapper>
);

// Sound Recorder Icon
export const SoundRecorderIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #ff8080, #c00000)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaMusic style={{ color: '#ffffff', fontSize: '18px' }} />
    </div>
  </IconWrapper>
);

// Media Player Icon
export const MediaPlayerIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #8080ff, #4040c0)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '0',
        height: '0',
        borderLeft: '10px solid #ffffff',
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent'
      }} />
    </div>
  </IconWrapper>
);

// Network Icon
export const NetworkIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #80ff80, #40c040)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaNetworkWired style={{ color: '#004000', fontSize: '18px' }} />
    </div>
  </IconWrapper>
);

// Recycle Bin Icon
export const RecycleBinIcon = ({ size = 32, isEmpty = true }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaTrash style={{ 
        color: isEmpty ? '#808080' : '#000080', 
        fontSize: '20px',
        filter: 'drop-shadow(1px 1px 2px #000000)'
      }} />
    </div>
  </IconWrapper>
);

// Control Panel Icon
export const ControlPanelIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #c0c0c0, #808080)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaCog style={{ color: '#000080', fontSize: '20px' }} />
    </div>
  </IconWrapper>
);

// Hard Disk Icon
export const HardDiskIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #404040, #000000)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaHdd style={{ color: '#c0c0c0', fontSize: '18px' }} />
    </div>
  </IconWrapper>
);

// Generic Application Icon
export const ApplicationIcon = ({ size = 32, color = '#8080ff', children }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${color}, ${color}80)`,
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '18px'
    }}>
      {children}
    </div>
  </IconWrapper>
);

// Text Editor Icon (Notepad)
export const NotepadIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <div style={{
        width: '20px',
        height: '24px',
        background: '#ffffff',
        border: '1px solid #000000',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '3px',
          left: '2px',
          right: '2px',
          height: '1px',
          background: '#000000'
        }} />
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '2px',
          right: '2px',
          height: '1px',
          background: '#000000'
        }} />
        <div style={{
          position: 'absolute',
          top: '9px',
          left: '2px',
          right: '2px',
          height: '1px',
          background: '#000000'
        }} />
      </div>
    </div>
  </IconWrapper>
);

export default {
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
  ApplicationIcon,
  NotepadIcon
}; 