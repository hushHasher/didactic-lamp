// src/pages/ProjectsPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectsPage from './ProjectsPage';
import { describe, it, expect } from 'vitest';

describe('ProjectsPage', () => {
  it('renders without crashing and displays a heading', () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );
    // Check for a heading, using the actual text from the component
    expect(screen.getByRole('heading', { level: 2, name: /C:\\ARCHIVES\\PROJECTS_OLD/i })).toBeInTheDocument();
  });
});
