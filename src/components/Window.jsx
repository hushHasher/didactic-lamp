import { useState, useRef, useEffect, useCallback } from 'react';
import './Window.css';

function Window({ 
  children, 
  title, 
  onClose, 
  initialPosition = { x: 100, y: 100 }, 
  initialSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
  resizable = true,
  icon = '📁',
  zIndex = 1000,
  onFocus
}) {
  const windowRef = useRef(null);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [windowState, setWindowState] = useState('normal'); // 'normal', 'minimized', 'maximized'
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const [normalStateBeforeMaximize, setNormalStateBeforeMaximize] = useState({
    position: initialPosition,
    size: initialSize
  });

  // Handle window focus
  const handleWindowClick = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  // Dragging functionality
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0 || windowState === 'maximized' || isResizing) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragStartOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    handleWindowClick();
    e.preventDefault();
  }, [windowState, isResizing, handleWindowClick]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - dragStartOffset.x, window.innerWidth - size.width));
      const newY = Math.max(0, Math.min(e.clientY - dragStartOffset.y, window.innerHeight - size.height));
      setPosition({ x: newX, y: newY });
    } else if (isResizing && resizeDirection) {
      const rect = windowRef.current.getBoundingClientRect();
      let newSize = { ...size };
      let newPosition = { ...position };

      if (resizeDirection.includes('right')) {
        newSize.width = Math.max(minSize.width, e.clientX - rect.left);
      }
      if (resizeDirection.includes('left')) {
        const newWidth = Math.max(minSize.width, rect.right - e.clientX);
        newPosition.x = rect.right - newWidth;
        newSize.width = newWidth;
      }
      if (resizeDirection.includes('bottom')) {
        newSize.height = Math.max(minSize.height, e.clientY - rect.top);
      }
      if (resizeDirection.includes('top')) {
        const newHeight = Math.max(minSize.height, rect.bottom - e.clientY);
        newPosition.y = rect.bottom - newHeight;
        newSize.height = newHeight;
      }

      setSize(newSize);
      setPosition(newPosition);
    }
  }, [isDragging, isResizing, resizeDirection, dragStartOffset, size, position, minSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  // Add event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Resize handle mouse down
  const handleResizeMouseDown = useCallback((direction) => (e) => {
    if (windowState === 'maximized') return;
    setIsResizing(true);
    setResizeDirection(direction);
    handleWindowClick();
    e.stopPropagation();
    e.preventDefault();
  }, [windowState, handleWindowClick]);

  // Window control buttons
  const handleMinimize = useCallback((e) => {
    e.stopPropagation();
    if (windowState === 'minimized') {
      setWindowState('normal');
    } else {
      setWindowState('minimized');
    }
  }, [windowState]);

  const handleMaximize = useCallback((e) => {
    e.stopPropagation();
    if (windowState === 'maximized') {
      setWindowState('normal');
      setPosition(normalStateBeforeMaximize.position);
      setSize(normalStateBeforeMaximize.size);
    } else {
      setNormalStateBeforeMaximize({ position, size });
      setWindowState('maximized');
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [windowState, position, size, normalStateBeforeMaximize]);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    onClose?.();
  }, [onClose]);

  // Double-click title bar to maximize/restore
  const handleTitleDoubleClick = useCallback((e) => {
    if (windowState !== 'minimized') {
      handleMaximize(e);
    }
  }, [windowState, handleMaximize]);

  // Window style based on state
  let windowStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    zIndex: zIndex,
    visibility: windowState === 'minimized' ? 'hidden' : 'visible',
  };

  if (windowState === 'maximized') {
    windowStyle = {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: zIndex,
    };
  }

  return (
    <div
      ref={windowRef}
      className={`window ${windowState}`}
      style={windowStyle}
      onClick={handleWindowClick}
    >
      {/* Title Bar */}
      <div
        className="window-title-bar"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        <div className="window-title">
          <span className="window-icon">{icon}</span>
          <span className="window-title-text">{title}</span>
        </div>
        <div className="window-controls">
          <button 
            className="window-control-btn minimize-btn" 
            onClick={handleMinimize}
            title={windowState === 'minimized' ? "Restore" : "Minimize"}
          >
            {windowState === 'minimized' ? '⬜' : '_'}
          </button>
          <button 
            className="window-control-btn maximize-btn" 
            onClick={handleMaximize}
            title={windowState === 'maximized' ? "Restore" : "Maximize"}
          >
            {windowState === 'maximized' ? '❐' : '□'}
          </button>
          <button 
            className="window-control-btn close-btn" 
            onClick={handleClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="window-content">
        {children}
      </div>

      {/* Resize Handles */}
      {resizable && windowState === 'normal' && (
        <>
          <div 
            className="resize-handle resize-n" 
            onMouseDown={handleResizeMouseDown('top')}
          />
          <div 
            className="resize-handle resize-s" 
            onMouseDown={handleResizeMouseDown('bottom')}
          />
          <div 
            className="resize-handle resize-e" 
            onMouseDown={handleResizeMouseDown('right')}
          />
          <div 
            className="resize-handle resize-w" 
            onMouseDown={handleResizeMouseDown('left')}
          />
          <div 
            className="resize-handle resize-ne" 
            onMouseDown={handleResizeMouseDown('top right')}
          />
          <div 
            className="resize-handle resize-nw" 
            onMouseDown={handleResizeMouseDown('top left')}
          />
          <div 
            className="resize-handle resize-se" 
            onMouseDown={handleResizeMouseDown('bottom right')}
          />
          <div 
            className="resize-handle resize-sw" 
            onMouseDown={handleResizeMouseDown('bottom left')}
          />
        </>
      )}
    </div>
  );
}

export default Window;