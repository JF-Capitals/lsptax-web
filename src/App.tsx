import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPortal from "./page/AdminPortal";
import LandingPage from "./page/LandingPage";
import LoginPage from "./components/portal/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Private Routes */}
        <Route path="/portal/*" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
