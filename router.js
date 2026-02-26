import { Layout } from './layout.js';


import AdopterLanding from './pages/adopter-landing.html?raw';
import AdopterAdopt from './pages/adopter-adopt.html?raw';
import NotFound from './pages/error.html?raw';

const routes = {
  '/': AdopterLanding,
  '/adopt': AdopterAdopt,
};

const app = document.getElementById('app');

function router() {
  const path = window.location.pathname;
  app.innerHTML = Layout(routes[path] || NotFound);
}

window.addEventListener('popstate', router);
window.addEventListener('DOMContentLoaded', router);

// Navigation helper
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-link]')) {
    e.preventDefault();
    history.pushState(null, '', e.target.href);
    router();
  }
});