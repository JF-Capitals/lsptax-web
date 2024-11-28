import React, { useState } from "react";

interface MenuOption {
  id: string;
  label: string;
}

interface SideMenuProps {
  onSelectOption: (id: string) => void; // Callback function to notify parent
}

const SideMenu: React.FC<SideMenuProps> = ({ onSelectOption }) => {
  const [activeOption, setActiveOption] = useState<string>("overview"); // Default active option

  const menuOptions: MenuOption[] = [
    { id: "clients", label: "Clients" },
    { id: "forms", label: "Forms" },
    { id: "invoices", label: "Invoices" },
    { id: "properties", label: "Properties" },
    { id: "prospects", label: "Prospects" },
  ];

  const handleOptionClick = (id: string) => {
    setActiveOption(id);
    onSelectOption(id); // Notify parent of the selected option
  };

  return (
    <div className="bg-red-100 h-screen w-64">
      {menuOptions.map((option) => (
        <div
          key={option.id}
          className={`bg-red-100 p-8 hover:bg-red-200 ${option.id === activeOption ? "active bg-blue-100" : ""}`}
          onClick={() => handleOptionClick(option.id)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
