import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Ensure the 'root' element exists and is of type HTMLDivElement
const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
} else {
  console.error('Root element not found');
}
