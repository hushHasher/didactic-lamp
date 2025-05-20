// src/hooks/useTypewriter.test.js
import { renderHook, act } from '@testing-library/react';
import useTypewriter from './useTypewriter';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock sessionStorage
    const store = {};
    Storage.prototype.getItem = vi.fn((key) => store[key] || null);
    Storage.prototype.setItem = vi.fn((key, value) => {
      store[key] = value.toString();
    });
    Storage.prototype.clear = vi.fn(() => {
        for (const key in store) {
            if (Object.prototype.hasOwnProperty.call(store, key)) {
                delete store[key];
            }
        }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Clears spies, mocks, and timers
    vi.useRealTimers();
    // Clear the mocked store directly
    Storage.prototype.clear();
  });

  it('should initialize with empty string and type out text for the first visit (animating visit)', () => {
    const fullText = 'Hello';
    const speed = 50;
    const pageKey = 'testKey1';

    // Ensure sessionStorage.getItem for pageKey returns null (first visit)
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);

    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));

    expect(result.current).toBe(''); // Initial state before any timers advance

    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('H');
    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('He');
    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('Hel');
    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('Hell');
    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('Hello');

    // Check sessionStorage calls
    expect(Storage.prototype.getItem).toHaveBeenCalledWith(pageKey);
    // Incremented visit count to 1, which means animation (1 % 3 === 1)
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(pageKey, '1');
  });

  it('should return full text immediately for a second visit (non-animating visit)', () => {
    const fullText = 'Welcome Back';
    const speed = 50;
    const pageKey = 'testKey2';

    // Simulate first visit already happened, count is 1
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('1');

    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));

    // 1 + 1 = 2nd visit. 2 % 3 !== 1, so no animation
    expect(result.current).toBe(fullText);
    expect(Storage.prototype.getItem).toHaveBeenCalledWith(pageKey);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(pageKey, '2'); // Visit count incremented
  });

  it('should return full text immediately for a third visit (non-animating visit)', () => {
    const fullText = 'Hello Again';
    const speed = 50;
    const pageKey = 'testKey3';

    // Simulate second visit already happened, count is 2
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('2');
    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));
    
    // 2 + 1 = 3rd visit. 3 % 3 !== 1, so no animation
    expect(result.current).toBe(fullText);
    expect(Storage.prototype.getItem).toHaveBeenCalledWith(pageKey);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(pageKey, '3');
  });


  it('should type out text for the fourth visit (animating visit)', () => {
    const fullText = 'Hi';
    const speed = 30;
    const pageKey = 'testKey4';

    // Simulate third visit already happened, count is 3
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('3');
    const { result, rerender } = renderHook(
        ({ text, typingSpeed, key }) => useTypewriter(text, typingSpeed, key),
        { initialProps: { text: fullText, typingSpeed: speed, key: pageKey } }
    );
    
    // 3 + 1 = 4th visit. 4 % 3 === 1, so animation should occur
    expect(result.current).toBe(''); // Initial state for animating visit

    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('H');
    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('Hi');

    expect(Storage.prototype.getItem).toHaveBeenCalledWith(pageKey);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(pageKey, '4');
  });


  it('should respect the provided typing speed', () => {
    const fullText = 'Fast';
    const speed = 10; // Faster speed
    const pageKey = 'speedTestKey';
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null); // First visit

    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));
    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('F');
    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('Fa');
    // ... and so on
  });

  it('should use default speed of 50ms if speed parameter is omitted', () => {
    const fullText = 'Default';
    const pageKey = 'defaultSpeedKey';
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null); // First visit

    const { result } = renderHook(() => useTypewriter(fullText, undefined, pageKey));
    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(50); }); // Default speed
    expect(result.current).toBe('D');
    act(() => { vi.advanceTimersByTime(50); });
    expect(result.current).toBe('De');
  });

  it('should animate if no pageKey is provided', () => {
    const fullText = 'NoKey';
    const speed = 50;

    const { result } = renderHook(() => useTypewriter(fullText, speed)); // No pageKey
    expect(result.current).toBe('');

    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('N');
    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('No');
    // ...
    expect(Storage.prototype.getItem).not.toHaveBeenCalled();
    expect(Storage.prototype.setItem).not.toHaveBeenCalled();
  });

  it('should handle empty string input gracefully (animating visit)', () => {
    const fullText = '';
    const speed = 50;
    const pageKey = 'emptyStringKey';
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null); // First visit

    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));
    expect(result.current).toBe(''); // Stays empty

    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe(''); // Still empty

    // sessionStorage should still be updated for visit count
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(pageKey, '1');
  });

  it('should handle empty string input gracefully (non-animating visit)', () => {
    const fullText = '';
    const speed = 50;
    const pageKey = 'emptyStringKeyNonAnimating';
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('1'); // 2nd visit

    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));
    expect(result.current).toBe(''); // Returns empty string immediately

    // sessionStorage should still be updated for visit count
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(pageKey, '2');
  });
  
  it('should animate if sessionStorage access fails', () => {
    const fullText = 'StorageFail';
    const speed = 50;
    const pageKey = 'failKey';

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SessionStorage not available');
    });
    // setItem would also fail, but getItem is checked first

    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));
    expect(result.current).toBe(''); // Should default to animating

    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('S');
    // setItem would not be called successfully in this mocked scenario
  });

  it('should animate if sessionStorage stores a non-numeric visit count', () => {
    const fullText = 'CorruptStorage';
    const speed = 50;
    const pageKey = 'corruptKey';

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('not-a-number');

    const { result } = renderHook(() => useTypewriter(fullText, speed, pageKey));
    expect(result.current).toBe(''); // Should default to animating (newVisitCount % 3 === 1 because newVisitCount becomes 1)

    act(() => { vi.advanceTimersByTime(speed); });
    expect(result.current).toBe('C');
    
    // It should reset the count to 1
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(pageKey, '1');
  });
});
