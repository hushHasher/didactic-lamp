// src/pages/AboutPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';
import { describe, it, expect } from 'vitest';

describe('AboutPage', () => {
  it('renders without crashing and displays a heading', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    // Check for a heading, using the actual text from the component
    expect(screen.getByRole('heading', { level: 2, name: /C:\\WILLOW_ARCHIVE\\CONVERGENCE_EVENT_8X9X.LOG/i })).toBeInTheDocument();
  });
});
