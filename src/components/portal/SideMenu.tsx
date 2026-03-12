import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  FileText,
  Users,
  UserPlus,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
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
  { id: "clients/list-client", label: "Clients", icon: Users },
  { id: "properties", label: "Properties", icon: Building },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "prospects/list-prospect", label: "Prospects", icon: UserPlus },
  { id: "csv-uploads", label: "CSV Uploads", icon: UploadCloud },
];

const SideMenu: React.FC = () => {
  const location = useLocation();
  const activeOption = location.pathname.split("/portal/")[1];
  const [isOpen, setIsOpen] = useState(true);

  return (
    <TooltipProvider>
      <div
        className={`h-full bg-white transition-all border-r flex flex-col items-center ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <button
          type="button"
          className="self-end mr-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* Logo */}
        <div className={`mt-6 transition-all ${isOpen ? "w-24" : "w-12"}`}>
          <img src={mainLogo} alt="Lone Star Property Tax portal logo" className="w-full" />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col w-full mt-8 overflow-hidden">
          {" "}
          {/* Prevent overflow */}
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
