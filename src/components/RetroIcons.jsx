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
  FaFolderOpen,
  FaArchive,
  FaMicrochip,
  FaWrench
} from 'react-icons/fa';

// Custom Windows 3.1 style icon wrapper with authentic 3D styling
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
      border: '1px outset #c0c0c0',
      backgroundColor: '#c0c0c0',
      ...style
    }}
  >
    {children}
  </div>
);

// MS-DOS Terminal Icon - Enhanced with better contrast
export const MSDOSIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #000080, #000040)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      textShadow: '1px 1px 0px #000000'
    }}>
      C:\&gt;_
    </div>
  </IconWrapper>
);

// Norton Commander Icon - Classic blue and yellow
export const NortonCommanderIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #000080, #0000c0)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Left panel representation */}
      <div style={{
        position: 'absolute',
        left: '3px',
        top: '4px',
        width: '10px',
        height: '20px',
        background: '#ffff00',
        border: '1px solid #000000',
        fontSize: '6px',
        color: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        F
      </div>
      {/* Right panel representation */}
      <div style={{
        position: 'absolute',
        right: '3px',
        top: '4px',
        width: '10px',
        height: '20px',
        background: '#ffff00',
        border: '1px solid #000000',
        fontSize: '6px',
        color: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        F
      </div>
      {/* NC text */}
      <div style={{
        position: 'absolute',
        bottom: '2px',
        fontSize: '8px',
        color: '#ffffff',
        fontWeight: 'bold',
        textShadow: '1px 1px 0px #000000'
      }}>
        NC
      </div>
    </div>
  </IconWrapper>
);

// WinRAR Archive Manager Icon
export const WinRARIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #ff4040, #c00000)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <FaArchive style={{ color: '#ffffff', fontSize: '18px' }} />
      <div style={{
        position: 'absolute',
        bottom: '2px',
        right: '2px',
        width: '8px',
        height: '6px',
        background: '#ffff00',
        border: '1px solid #000000',
        fontSize: '6px',
        textAlign: 'center',
        lineHeight: '6px'
      }}>
        R
      </div>
    </div>
  </IconWrapper>
);

// System Tools Icon
export const SystemToolsIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #808080, #404040)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <FaWrench style={{ color: '#ffffff', fontSize: '18px' }} />
    </div>
  </IconWrapper>
);

// Disk Defragmenter Icon
export const DefragIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #404040, #000000)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <FaHdd style={{ color: '#c0c0c0', fontSize: '16px' }} />
      {/* Defrag progress bars */}
      <div style={{
        position: 'absolute',
        bottom: '3px',
        width: '20px',
        height: '3px',
        background: '#00ff00',
        border: '1px solid #000000'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '6px',
        width: '15px',
        height: '2px',
        background: '#ff0000'
      }} />
    </div>
  </IconWrapper>
);

// Character Map Icon
export const CharMapIcon = ({ size = 32 }) => (
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
        height: '20px',
        background: '#ffffff',
        border: '1px inset #c0c0c0',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        fontSize: '6px',
        color: '#000000'
      }}>
        <div>A</div><div>B</div><div>C</div><div>D</div>
        <div>E</div><div>F</div><div>G</div><div>H</div>
        <div>1</div><div>2</div><div>3</div><div>4</div>
        <div>@</div><div>#</div><div>$</div><div>%</div>
      </div>
    </div>
  </IconWrapper>
);

// Enhanced File Manager Icon with better 3D effect
export const FileManagerIcon = ({ size = 32 }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #ffff80, #c0c000)',
      border: '2px outset #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <FaFolderOpen style={{ 
        color: '#000080', 
        fontSize: '20px',
        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Enhanced My Computer Icon with classic styling
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
      <FaDesktop style={{ color: '#000080', fontSize: '18px' }} />
      {/* Classic "My Computer" indicator */}
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

// Program Manager Icon - Enhanced
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
        width: '18px',
        height: '18px',
        background: 'linear-gradient(135deg, #ffffff, #e0e0e0)',
        border: '2px outset #c0c0c0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#000080'
      }}>
        PM
      </div>
    </div>
  </IconWrapper>
);

// Solitaire Game Icon - Enhanced
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
        background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
        border: '1px solid #000000',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: '#ff0000',
        textShadow: '0.5px 0.5px 0px #000000'
      }}>
        ♠
      </div>
    </div>
  </IconWrapper>
);

// Paint Icon - Enhanced
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
      <FaPaintBrush style={{ 
        color: '#800080', 
        fontSize: '20px',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Calculator Icon - Enhanced
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
      <FaCalculator style={{ 
        color: '#000080', 
        fontSize: '20px',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Sound Recorder Icon - Enhanced
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
      <FaMusic style={{ 
        color: '#ffffff', 
        fontSize: '18px',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Media Player Icon - Enhanced
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
        borderLeft: '12px solid #ffffff',
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Network Icon - Enhanced
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
      <FaNetworkWired style={{ 
        color: '#004000', 
        fontSize: '18px',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Recycle Bin Icon - Enhanced
export const RecycleBinIcon = ({ size = 32, isEmpty = true }) => (
  <IconWrapper size={size}>
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0e0e0, #a0a0a0)',
      border: '2px outset #c0c0c0'
    }}>
      <FaTrash style={{ 
        color: isEmpty ? '#808080' : '#000080', 
        fontSize: '20px',
        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Control Panel Icon - Enhanced
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
      <FaCog style={{ 
        color: '#000080', 
        fontSize: '20px',
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
      }} />
    </div>
  </IconWrapper>
);

// Hard Disk Icon - Enhanced
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
      <FaHdd style={{ 
        color: '#c0c0c0', 
        fontSize: '18px',
        filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.3))'
      }} />
    </div>
  </IconWrapper>
);

// Generic Application Icon - Enhanced
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
      fontSize: '18px',
      textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
    }}>
      {children}
    </div>
  </IconWrapper>
);

// Text Editor Icon (Notepad) - Enhanced
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
        background: 'linear-gradient(135deg, #ffffff, #f8f8f8)',
        border: '1px solid #000000',
        position: 'relative'
      }}>
        {/* Text lines */}
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
  ApplicationIcon,
  NotepadIcon
}; 