import { useState, useEffect } from 'react';

/**
 * A custom hook for creating a typewriter effect.
 * @param {string} text The full text to type out.
 * @param {number} [speed=50] The delay between typing each character (in milliseconds).
 * @returns {string} The currently typed portion of the text.
 */
function useTypewriter(text, speed = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset index if text changes
    setCurrentIndex(0);
    setDisplayedText('');
  }, [text]); // Only reset when the input text itself changes

  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      return; // Stop if text is empty or fully typed
    }

    const timeoutId = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    // Cleanup function to clear the timeout if the component unmounts
    // or if text/speed changes mid-effect
    return () => clearTimeout(timeoutId);

  }, [text, speed, currentIndex]); // Re-run effect when index changes

  return displayedText;
}

export default useTypewriter; 