// src/pages/HomePage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage'; // Assuming the test file is in src/pages
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock sessionStorage for useTypewriter hook
beforeEach(() => {
  vi.useFakeTimers();
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
  vi.restoreAllMocks();
  vi.useRealTimers();
  Storage.prototype.clear();
});

describe('HomePage', () => {
  it('renders without crashing and displays key static text', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // A simple check for some static text expected on the HomePage
    expect(screen.getByText(/SYSTEM ONLINE/i)).toBeInTheDocument();
    expect(screen.getByText(/WEYLAND CORP TERMINAL INTERFACE/i)).toBeInTheDocument();
  });
});
