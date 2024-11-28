import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AdminPortal from "./page/AdminPortal"
import LandingPage from "./page/LandingPage"


function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/portal" element={<AdminPortal />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
