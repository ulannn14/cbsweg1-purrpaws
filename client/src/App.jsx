import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdopterLanding from "./pages/AdopterLanding";
import AdopterAdopt from "./pages/AdopterAdopt";
import AdopterAsean from "./pages/AdopterAsean";
import PetDetail from "./pages/PetDetail";
import AdopterApplication from "./pages/AdopterApplication";
import AdopterApplicationDetail from "./pages/AdopterApplicationDetail";
import AdopterProfile from "./pages/AdopterProfile"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdopterLanding />} />
        <Route path="/adopt" element={<AdopterAdopt />} />
        <Route path="/adopt/:id" element={<PetDetail />} />
        <Route path="/asean-info" element={<AdopterAsean />} />
        <Route path="/applications" element={<AdopterApplication />} />
        <Route path="/applications/:id" element={<AdopterApplicationDetail />} />
        <Route path="/profile" element={<AdopterProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;