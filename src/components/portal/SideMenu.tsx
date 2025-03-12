import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Building,
  FileText,
  Users,
  UserPlus,
  // FileSignature,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import mainLogo from "@/assets/dashboard/main-logo.svg";

interface MenuOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

const menuOptions: MenuOption[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "properties", label: "Properties", icon: Building },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "clients/list-client", label: "Clients", icon: Users },
  { id: "prospects/list-prospect", label: "Prospects", icon: UserPlus },
  // { id: "forms/contract", label: "Contracts", icon: FileSignature },
];

const SideMenu: React.FC = () => {
  const location = useLocation();
  const activeOption = location.pathname.split("/portal/")[1];
  const [isOpen, setIsOpen] = useState(true);

  return (
    <TooltipProvider>
      <div
        className={`h-screen bg-white transition-all border-r flex flex-col items-center ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <button
          className="self-end mt-4 mr-4 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className={`mt-6 transition-all ${isOpen ? "w-24" : "w-12"}`}>
          <img src={mainLogo} alt="Logo" className="w-full" />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col w-full mt-8">
          {menuOptions.map(({ id, label, icon: Icon }) => {
            const isActive = activeOption.startsWith(id);

            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={`/portal/${id}`}
                    className={`flex items-center p-4 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#F2F7FF] text-[#384295] font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${
                      isOpen ? "justify-start gap-3 px-6" : "justify-center"
                    }`}
                  >
                    <Icon
                      size={24}
                      className={`${
                        isActive ? "text-[#384295]" : "text-gray-600"
                      }`}
                    />
                    {isOpen && <span>{label}</span>}
                  </NavLink>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">{label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SideMenu;
