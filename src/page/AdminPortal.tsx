import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SideMenu from "@/components/portal/SideMenu";
import AdminRoutes from "@/routes/adminRoutes";
import DashboardHeader from "@/components/portal/DashboardHeader";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";

const AdminPortal = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background to-brand-muted/30">
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
          <main id="main" className="flex-1 overflow-auto" tabIndex={-1}>
            <Breadcrumbs />
            <Routes>
              <Route path="/*" element={<AdminRoutes />} />
            </Routes>
          </main>
        </div>
      </div>
      {/* Overlay for Small Screens */}
      {isMenuOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsMenuOpen(false);
            }
          }}
          aria-label="Close menu"
        />
      )}
    </div>
  );
};
export default AdminPortal;
