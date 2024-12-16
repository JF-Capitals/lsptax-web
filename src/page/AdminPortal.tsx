import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import SideMenu from "@/components/portal/SideMenu";
import AdminRoutes from "@/routes/adminRoutes"; // Import the AdminRoutes
import DashboardHeader from "@/components/portal/DashboardHeader";

const AdminPortal = () => {
  return (
    <div className="bg-[#F8F9FD] ">
      <div className="flex">
        <SideMenu />
        {/* Add Routes here to render AdminRoutes */}
        <div className="flex-1">
          <DashboardHeader />
          <Routes>
            <Route path="/*" element={<AdminRoutes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
