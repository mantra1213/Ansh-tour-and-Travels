import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Immediate Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => console.log('ANSH PWA Ready'))
    .catch(err => console.error('PWA Registration Failed:', err));
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