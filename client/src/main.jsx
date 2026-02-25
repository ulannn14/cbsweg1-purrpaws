import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';

import '/public/css/global.css';
import './styles/adopter-landingpage.css';
import './styles/adopter-adopt.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);