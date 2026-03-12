import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdopterLanding from "./pages/AdopterLanding";
import AdopterAdopt from "./pages/AdopterAdopt";
import AdopterAsean from "./pages/AdopterAsean";
import PetDetail from "./pages/PetDetail";
import OrgDetail from "./pages/OrgDetail";
import AdopterApplication from "./pages/AdopterApplication";
import AdopterApplicationDetail from "./pages/AdopterApplicationDetail";
import AdopterProfile from "./pages/AdopterProfile"
import OrgLanding from "./pages/OrgLanding";  
import OrgPets from "./pages/OrgPets";
import EditPet from "./pages/EditPet";
import NewPet from "./pages/NewPet";
import OrgProfile from "./pages/OrgProfile";
import NotFound from "./pages/NotFound"
import AdopterApply from "./pages/AdopterApply";
import OrgApplication from "./pages/OrgApplication";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/adopter" element={<AdopterLanding />} />
        <Route path="/adopt" element={<AdopterAdopt />} />
        <Route path="/adopt/:id" element={<PetDetail />} />
        <Route path="/organizations/:id" element={<OrgDetail />} />
        <Route path="/apply/:id" element={<AdopterApply />} />
        <Route path="/asean-info" element={<AdopterAsean />} />
        <Route path="/applications" element={<AdopterApplication />} />
        <Route path="/applications/:id" element={<AdopterApplicationDetail />} />
        <Route path="/profile" element={<AdopterProfile />} />
        <Route path="/org" element={<OrgLanding />} />
        <Route path="/org/pets" element={<OrgPets />} />
        <Route path="/edit-pet/:id" element={<EditPet />} />
        <Route path="/new-pet" element={<NewPet />} />
        <Route path="/org/profile" element={<OrgProfile />} />
        <Route path="/org/applications/:id" element={<OrgApplication />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;