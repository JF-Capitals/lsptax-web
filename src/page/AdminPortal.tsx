import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import SideMenu from "@/components/portal/SideMenu";
import PortalHeader from "@/components/portal/PortalHeader";
import AdminRoutes from "@/routes/adminRoutes"; // Import the AdminRoutes

const AdminPortal = () => {
  return (
    <div className="h-screen">
      <PortalHeader />
      <div className="flex">
        <SideMenu />
        {/* Add Routes here to render AdminRoutes */}
        <div className="flex-1 border p-4 m-4 rounded-xl">
          <Routes>
            <Route path="/*" element={<AdminRoutes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
