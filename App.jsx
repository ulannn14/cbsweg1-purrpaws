import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdopterLanding from "./pages/AdopterLanding";
import AdopterAdopt from "./pages/AdopterAdopt";
import PetDetail from "./pages/PetDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdopterLanding />} />
        <Route path="/adopt" element={<AdopterAdopt />} />
        <Route path="/pets/:id" element={<PetDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;