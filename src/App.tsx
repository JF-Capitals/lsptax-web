// App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPortal from "./page/AdminPortal";
import LandingPage from "./page/LandingPage";
import LoginPage from "./page/LoginPage";
import ProtectedRoute from "./utils/ProtectedRoute";


function App() {
  // Simulate authentication check (replace this with your actual logic)
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/portal/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPortal />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
