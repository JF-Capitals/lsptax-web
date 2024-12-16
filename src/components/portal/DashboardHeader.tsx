import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { BellIcon, ChevronDown, User2 } from "lucide-react";

const CurrentDate: React.FC = () => {
  const formatDate = (): string => {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    // Add ordinal suffix (st, nd, rd, th)
    const ordinalSuffix = (date: number): string => {
      if (date > 3 && date < 21) return "th";
      switch (date % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `Today is ${dayName}, ${date}${ordinalSuffix(
      date
    )} ${month} ${year}`;
  };

  return <h3>{formatDate()}</h3>;
};

interface DashboardHeaderProps {
  icon: string;
  label: string;
  desc: string;
}

const headerData = [
  {
    id: "properties",
    icon: "",
    label: "Properties",
    desc: "See all Properties here.",
  },
  {
    id: "invoices",
    icon: "",
    label: "Invoices",
    desc: "See all Invoices here.",
  },
  {
    id: "contract-owner",
    icon: "",
    label: "Contract Owner",
    desc: "See all Contract Owner here.",
  },
  {
    id: "clients/list-client",
    icon: "",
    label: "Clients",
    desc: "View, search for and add new Client.",
  },
  {
    id: "prospects/list-prospect",
    icon: "",
    label: "Prospects",
    desc: "View, search for and add new Prospect.",
  },
  {
    id: "forms/contract",
    icon: "",
    label: "Contracts",
    desc: "View, search for and add new Contracts.",
  },
  {
    id: "forms/agent",
    icon: "",
    label: "Agents",
    desc: "View, search for and add new Agents.",
  },
];

const DashboardHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/portal/")[1];

  // If there's no path after /portal, treat it as the dashboard
  const isDashboard = !currentPath;

  const currentHeader = headerData.find((item) => item.id === currentPath);

  return (
    <div className="flex justify-between p-4">
      <div>
        {isDashboard ? (
          <HeaderDescriptionItem
            icon=""
            label="Welcome, Hussain"
            desc="This is your dashboard."
          />
        ) : currentHeader ? (
          <HeaderDescriptionItem
            icon={currentHeader.icon}
            label={currentHeader.label}
            desc={currentHeader.desc}
          />
        ) : (
          <CurrentDate />
        )}
      </div>
      <div className="flex justify-center align-center items-center gap-4">
        <BellIcon />
        <div className="flex justify-center align-center items-center gap-4">
          <User2 />
          <div className="">
            <h1>username</h1>
            <h2 className="font-thin text-sm">userType</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 font-semibold">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const HeaderDescriptionItem = ({ icon, label, desc }: DashboardHeaderProps) => {
  return (
    <div>
      {icon && <img src={icon} alt="" />}
      <h2 className="font-bold">{label}</h2>
      <h3 className="text-sm font-thin">{desc ? desc : <CurrentDate />}</h3>
    </div>
  );
};

export default DashboardHeader;
