import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Ensure default import if you use default export
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
