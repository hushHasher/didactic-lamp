// src/components/FooterClock.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import FooterClock from './FooterClock';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('FooterClock', () => {
  beforeEach(() => {
    // Mock Date for consistent time testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing and displays the current time', () => {
    // Set a specific date and time
    const mockDate = new Date(2024, 6, 21, 12, 30, 45); // July 21, 2024, 12:30:45
    vi.setSystemTime(mockDate);

    render(<FooterClock />);

    // Check for the time format (e.g., HH:MM:SS)
    // The exact text will depend on the formatting in FooterClock
    // For example, if it's HH:MM:SS AM/PM
    expect(screen.getByText(/12:30:45 PM/i)).toBeInTheDocument(); // Adjust regex as per actual output
  });

  it('updates the time every second', () => {
    const initialDate = new Date(2024, 6, 21, 10, 10, 10);
    vi.setSystemTime(initialDate);

    render(<FooterClock />);
    expect(screen.getByText(/10:10:10 AM/i)).toBeInTheDocument();

    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText(/10:10:11 AM/i)).toBeInTheDocument();

    // Advance time by another 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/10:10:13 AM/i)).toBeInTheDocument();
  });
});
