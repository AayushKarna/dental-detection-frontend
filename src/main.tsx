import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ResultProvider } from './components/ResultContext.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResultProvider>
      <App />
    </ResultProvider>
  </StrictMode>
);
