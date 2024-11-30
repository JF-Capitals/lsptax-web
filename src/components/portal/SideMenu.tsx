import { ChevronUp, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface SubMenuOption {
  id: string;
  label: string;
}

interface MenuOption {
  id: string;
  label: string;
  subOptions?: SubMenuOption[];
}

const SideMenu: React.FC = () => {
  const location = useLocation();
  const activeOption = location.pathname.split("/")[2]; // Get the second part of the path after /portal/

  const [openMenu, setOpenMenu] = useState<string | null>(null); // State to track which menu is open

  const menuOptions: MenuOption[] = [
    {
      id: "properties",
      label: "Properties",
    },
    {
      id: "invoices",
      label: "Invoices",
    },
    {
      id: "contract-owner",
      label: "Contract Owner",
    },
    {
      id: "clients",
      label: "Clients",
      subOptions: [
        { id: "add-client", label: "Add Client" },
        { id: "list-client", label: "List Clients" },
      ],
    },
    {
      id: "prospects",
      label: "Prospects",
      subOptions: [
        { id: "add-prospect", label: "Add Prospect" },
        { id: "list-prospect", label: "List Prospects" },
      ],
    },
    {
      id: "forms",
      label: "Forms",
      subOptions: [
        { id: "contract", label: "Contract" },
        { id: "agent", label: "Agent" },
      ],
    },
  ];

  // Function to handle menu toggle
  const toggleMenu = (id: string) => {
    setOpenMenu((prevOpenMenu) => (prevOpenMenu === id ? null : id)); // Toggle open/close
  };

  return (
    <div className="w-96 border rounded-xl p-4 m-4">
      <div className="text-2xl font-bold">Lone Star Property Tax</div>
      <NavLink to="/portal">
        <div className="text-xl p-8 hover:bg-red-100 rounded-xl m-2">Dashboard</div>
      </NavLink>
      <hr />
      {/* Render non-submenu items */}
      {menuOptions
        .filter((option) => !option.subOptions)
        .map((option) => (
          <NavLink
            key={option.id}
            to={`/portal/${option.id}`}
            className={`flex items-center justify-between p-8 hover:border rounded-xl m-2 ${
              option.id === activeOption ? "active bg-blue-100" : ""
            }`}
          >
            <span>{option.label}</span>
          </NavLink>
        ))}

      {/* Render submenu items */}
      {menuOptions
        .filter((option) => option.subOptions)
        .map((option) => (
          <div key={option.id}>
            {/* Main menu item with sub-options toggle */}
            <div
              className={`flex items-center justify-between p-8 hover:border rounded-xl `}
              onClick={() => toggleMenu(option.id)} // Toggle only if there are sub-options
            >
              <span>{option.label}</span>
              {option.subOptions && (
                <span>
                  {openMenu === option.id ? <ChevronUp /> : <ChevronRight />}
                </span>
              )}
            </div>

            {/* Submenu items (if any) */}
            {option.subOptions && openMenu === option.id && (
              <div className="flex flex-col border">
                {option.subOptions.map((subOption) => {
                  const isSubActive = location.pathname.includes(subOption.id);
                  return (
                    <NavLink
                      key={subOption.id}
                      to={`/portal/${option.id}/${subOption.id}`}
                      className={`p-1 pl-16 ${isSubActive ? "bg-blue-500" : ""}`}
                    >
                      {subOption.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default SideMenu;
