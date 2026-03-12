import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar      from "./components/layout/NavBar.jsx";
import RecommendPage from "./pages/RecommendPage.jsx";
import CompsPage     from "./pages/CompsPage.jsx";
import CoachPage from "./pages/CoachPage.jsx";
import TacticalSimulatorPage from "./pages/TacticalSimulatorPage.jsx";
import ComingSoon    from "./pages/ComingSoon.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-base min-h-screen">
        <NavBar />
        <Routes>
          <Route path="/"          element={<RecommendPage />} />
          <Route path="/comps"     element={<CompsPage />} />
          <Route path="/coach"     element={<CoachPage path="/coach" />} />
          <Route path="/simulator"     element={<TacticalSimulatorPage path="/simulator" />} />
          <Route path="/placement" element={<ComingSoon path="/placement" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}