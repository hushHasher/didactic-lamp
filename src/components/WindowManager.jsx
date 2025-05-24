import { useState, useCallback, useRef } from 'react';
import Window from './Window';

function WindowManager({ children, windows = [], onWindowsChange }) {
  const [focusedWindowId, setFocusedWindowId] = useState(null);
  const nextZIndexRef = useRef(1000);

  const handleWindowFocus = useCallback((windowId) => {
    setFocusedWindowId(windowId);
    onWindowsChange?.(windows.map(w => 
      w.id === windowId 
        ? { ...w, zIndex: nextZIndexRef.current++ }
        : w
    ));
  }, [windows, onWindowsChange]);

  const handleWindowClose = useCallback((windowId) => {
    const updatedWindows = windows.filter(w => w.id !== windowId);
    onWindowsChange?.(updatedWindows);
    
    // If the closed window was focused, focus the topmost remaining window
    if (focusedWindowId === windowId && updatedWindows.length > 0) {
      const topWindow = updatedWindows.reduce((top, current) => 
        current.zIndex > top.zIndex ? current : top
      );
      setFocusedWindowId(topWindow.id);
    } else if (updatedWindows.length === 0) {
      setFocusedWindowId(null);
    }
  }, [windows, onWindowsChange, focusedWindowId]);

  return (
    <>
      {children}
      {windows.map((window) => (
        <Window
          key={window.id}
          title={window.title}
          icon={window.icon}
          initialPosition={window.position}
          initialSize={window.size}
          minSize={window.minSize}
          resizable={window.resizable}
          zIndex={window.zIndex}
          onClose={() => handleWindowClose(window.id)}
          onFocus={() => handleWindowFocus(window.id)}
        >
          {window.content}
        </Window>
      ))}
    </>
  );
}

export default WindowManager; 