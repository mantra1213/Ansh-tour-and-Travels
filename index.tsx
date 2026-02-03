import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Professional Service Worker Registration for PWA Stores
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then((registration) => {
        console.log('ANSH PWA Registered. Scope:', registration.scope);
      })
      .catch((err) => {
        // We log as a warning because preview origins often block SW registration
        console.warn('PWA Service Worker registration skipped or failed in current origin:', err.message);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);