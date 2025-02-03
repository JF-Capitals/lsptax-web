
import LoginPage from "@/page/LoginPage";
import { Route, Routes } from "react-router-dom";

const authRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default authRoutes;
