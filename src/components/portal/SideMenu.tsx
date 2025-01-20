import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import mainLogo from "@/assets/dashboard/main-logo.svg";

interface MenuOption {
  id: string;
  label: string;
}

const SideMenu: React.FC = () => {
  const location = useLocation();
  const activeOption = location.pathname.split("/portal/")[1]; // Get the full path after /portal/

  const menuOptions: MenuOption[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "properties", label: "Properties" },
    { id: "invoices", label: "Invoices" },
    // { id: "contract-owner", label: "Contract Owner" },
    { id: "clients/list-client", label: "Clients" },
    // { id: "prospects/list-prospect", label: "Prospects" },
    { id: "forms/contract", label: "Contracts" },
    // { id: "forms/agent", label: "Agents" },
  ];

  return (
    <div className="w-64 bg-white h-screen ">
      <div className="flex justify-center items-center py-4">
        <img src={mainLogo} alt="Logo" />
      </div>
      <div className="flex flex-col items-center align-center">
        {menuOptions.map((option) => (
          <div
            key={option.id}
            className="group flex justify-center items-center hover:bg-[#F2F7FF] hover:border-l-4 hover:border-[#5584CE] transition-all w-full"
          >
            {/* NavLink */}
            <NavLink
              to={`/portal/${option.id}`}
              className={`flex text-center items-center p-4 w-full ${
                activeOption.startsWith(option.id)
                  ? "bg-[#F2F7FF] text-transparent bg-gradient-to-r from-[#14ADD6] to-[#384295] bg-clip-text"
                  : ""
              }`}
            >
              <span>{option.label}</span>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
