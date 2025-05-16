import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
<<<<<<< HEAD

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
=======
import ConsoleDebugger from './console-debugger.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConsoleDebugger />
    <App />
  </StrictMode>
);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
