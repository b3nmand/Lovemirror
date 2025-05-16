import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ConsoleDebugger from './console-debugger.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConsoleDebugger />
    <App />
  </StrictMode>
);