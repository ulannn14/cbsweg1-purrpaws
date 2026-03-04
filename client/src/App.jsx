import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdopterLanding from "./pages/AdopterLanding";
import AdopterAdopt from "./pages/AdopterAdopt";
import AdopterAsean from "./pages/AdopterAsean";
import PetDetail from "./pages/PetDetail";
import AdopterApplication from "./pages/AdopterApplication";
import AdopterApplicationDetail from "./pages/AdopterApplicationDetail";
import AdopterProfile from "./pages/AdopterProfile"
import OrgLanding from "./pages/OrgLanding";  
import OrgPets from "./pages/OrgPets";
import OrgProfile from "./pages/OrgProfile";
import NotFound from "./pages/NotFound"

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
        <Route path="/org" element={<OrgLanding />} />
        <Route path="/org/pets" element={<OrgPets />} />
        <Route path="/org/profile" element={<OrgProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;