import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { BellIcon, ChevronDown, Menu, User2 } from "lucide-react";
import { logoutUser } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

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

    return `${dayName}, ${date}${ordinalSuffix(date)} ${month} ${year}`;
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

const DashboardHeader = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/portal/")[1];

  const name = localStorage.getItem("username");


  console.log("USER:", name)

  async function logoutHandler() {
    try {
      logoutUser();
      // Show success toast
      toast({
        title: "Logged Out!",
      });
console.log("hi")
      navigate("/login"); // Relative routejhg
    } catch (error) {}
  }

  // If there's no path after /portal, treat it as the dashboard
  const isDashboard = !currentPath;

  const currentHeader = headerData.find((item) => item.id === currentPath);
  // const [username, setUsername] = useState<string | null>("Hussain");

  // useEffect(() => {
  //   // Retrieve the username from localStorage
  //   const storedUsername = localStorage.getItem("username");
  //   setUsername(storedUsername);
  // }, []);

  return (
    <div className="flex justify-between p-4">
      {/* Hamburger Menu Button (Small Screens) */}
      <button className="sm:hidden p-2 text-gray-700" onClick={onMenuToggle}>
        <Menu size={24} />
      </button>
      <div>
        {isDashboard ? (
          <HeaderDescriptionItem
            icon=""
            label={`Welcome,${`${localStorage.getItem("user")}`}`}
            desc="This is your dashboard."
          />
        ) : currentHeader ? (
          <HeaderDescriptionItem
            icon={currentHeader.icon}
            label={currentHeader.label}
            desc={currentHeader.desc}
          />
        ) : (
          <div className="hidden md:block">
            <HeaderDescriptionItem
              icon={""}
              label={`Welcome, ${name}`}
              desc={""}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center align-center items-center gap-4">
        <BellIcon />
        <div className="flex justify-center align-center items-center gap-4">
          <User2 />
          <div className="">
            <h1>{name}</h1>
            {/* <h2 className="font-thin text-sm">userType</h2> */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 font-semibold">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={logoutHandler}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const HeaderDescriptionItem = ({ icon, label, desc }: DashboardHeaderProps) => {
  return (
    <div className="">
      {icon && <img src={icon} alt="" />}
      <h2 className="font-extrabold text-xl">{label}</h2>
      <h3 className="text-sm font-thin">{desc ? desc : <CurrentDate />}</h3>
    </div>
  );
};

export default DashboardHeader;
