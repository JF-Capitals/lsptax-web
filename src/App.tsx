// App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPortal from "./page/AdminPortal";
import LandingPage from "./page/LandingPage";

import ProtectedRoute from "./utils/ProtectedRoute";
import LoginPage from "./page/LoginPage";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/portal/*"
          element={
            <ProtectedRoute >
              <AdminPortal />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
