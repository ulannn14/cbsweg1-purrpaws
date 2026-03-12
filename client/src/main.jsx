import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';

import '/public/css/global.css';
import './styles/adopter-landingpage.css';
import './styles/adopter-adopt.css';
import './styles/adopter-asean.css';
import './styles/adopter-application.css';
import "./styles/adopter-profile.css";
import './styles/org-landing.css';
import './styles/org-pets.css';
import './styles/edit-pet.css';
import './styles/new-pet.css';
import './styles/org-profile.css';
import './styles/login.css';
import './styles/signup.css';
import './styles/org-detail.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);