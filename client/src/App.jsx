import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdopterLanding from "./pages/AdopterLanding";
import AdopterAdopt from "./pages/AdopterAdopt";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdopterLanding />} />
        <Route path="/adopt" element={<AdopterAdopt />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;