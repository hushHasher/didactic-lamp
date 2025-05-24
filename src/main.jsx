// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import 'tuicss/dist/tuicss.min.css'; // Import TuiCss styles
import './index.css'; // Import global styles
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/didactic-lamp">
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);