import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SideMenu from "@/components/portal/SideMenu";
import AdminRoutes from "@/routes/adminRoutes";
import DashboardHeader from "@/components/portal/DashboardHeader";

const AdminPortal = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F8F9FD, #E3F2FD)", // Light bluish gradient
      }}
    >
      <div className="flex h-full">
        {/* Side Menu */}
        <div
          className={`fixed z-40 top-0 left-0 h-full bg-white shadow transition-transform transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } sm:relative sm:translate-x-0 sm:flex`}
        >
          <SideMenu />
        </div>
        {/* Main Content */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          <DashboardHeader onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/*" element={<AdminRoutes />} />
            </Routes>
          </div>
        </div>
      </div>
      {/* Overlay for Small Screens */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};
export default AdminPortal;
