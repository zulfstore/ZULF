import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has a setter so extension interceptors and test runners do not throw
try {
  const origFetch = window.fetch;
  let currentFetch = typeof origFetch === 'function' ? origFetch.bind(window) : origFetch;
  if (typeof Window !== 'undefined' && Window.prototype) {
    try {
      Object.defineProperty(Window.prototype, 'fetch', {
        get: () => currentFetch,
        set: (v) => { currentFetch = v; },
        configurable: true,
        enumerable: true
      });
    } catch {}
  }
} catch {}

createRoot(document.getElementById('root')!).render(<App />);
