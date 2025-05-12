import { useState, useEffect } from 'react';

/**
 * A custom hook for creating a typewriter effect, run only on specific visits.
 * @param {string} text The full text to type out.
 * @param {number} [speed=50] The delay between typing each character (in milliseconds).
 * @param {string} pageKey A unique key for the page to track visits in sessionStorage.
 * @returns {string} The currently typed portion of the text, or the full text if not animating.
 */
function useTypewriter(text, speed = 50, pageKey) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false); // State to control animation

  useEffect(() => {
    if (!pageKey) {
      // If no pageKey is provided, maybe default to always animating or never?
      // For now, let's default to animating if no key.
      setShouldAnimate(true);
      return;
    }

    // --- Visit Count Logic ---
    let currentVisitCount = 0;
    try {
      const storedCount = sessionStorage.getItem(pageKey);
      currentVisitCount = storedCount ? parseInt(storedCount, 10) : 0;
      if (isNaN(currentVisitCount)) {
        currentVisitCount = 0; // Reset if storage got corrupted
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      // Default to animating if storage fails
      setShouldAnimate(true);
      return;
    }

    const newVisitCount = currentVisitCount + 1;
    sessionStorage.setItem(pageKey, newVisitCount.toString());

    // Animate on the 1st, 4th, 7th... visit
    setShouldAnimate(newVisitCount % 3 === 1);

    // --- Reset typing state if animation should run ---
    if (newVisitCount % 3 === 1) {
      setCurrentIndex(0);
      setDisplayedText('');
    } else {
        // If not animating, immediately set the full text
        setDisplayedText(text);
    }

  }, [text, pageKey]); // Run this effect only when text or pageKey changes

  useEffect(() => {
    // --- Typing Logic ---
    // Only proceed if shouldAnimate is true and typing isn't finished
    if (!shouldAnimate || !text || currentIndex >= text.length) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeoutId);

  }, [text, speed, currentIndex, shouldAnimate]); // Re-run effect when index or shouldAnimate changes

  // Return the progressively typed text if animating, otherwise the full text immediately
  return shouldAnimate ? displayedText : text;
}

export default useTypewriter; 