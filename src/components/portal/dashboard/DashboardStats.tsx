import React, { useEffect, useState } from "react";
import clientsLogo from "@/assets/dashboard/client-logo.svg";
// import protestLogo from "@/assets/dashboard/protest-logo.svg";
import prospectLogo from "@/assets/dashboard/prospects-logo.svg";
// import agentsLogo from "@/assets/dashboard/agents-logo.svg";
import { dashboardData } from "@/store/data";
import { NavLink } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const statsItemData = [
  {
    label: "Active Clients",
    icon: clientsLogo,
    number: 250,
    desc: "",
    link: "/portal/clients/list-client",
  },
  // {
  //   label: "Total Protests",
  //   icon: protestLogo,
  //   number: 100,
  //   desc: "",
  //   link: "/portal/clients/list-protest",
  // },
  {
    label: "New Prospects",
    icon: prospectLogo,
    number: 10,
    desc: "",
    link: "/portal/prospects/list-prospect",
  },
  // {
  //   label: "Total Agents",
  //   icon: agentsLogo,
  //   number: 10,
  //   desc: "",
  //   link: "/portal/forms/agent",
  // },
];

interface StatsItemProps {
  label: string;
  icon: string;
  number: number;
  desc?: string;
  link: string;
}
interface Stats {
  numOfClients: number;
  numOfProspects: number;
  numOfAgents: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    // Fetch stats from dashboardData function
    const fetchStats = async () => {
      try {
        const fetchedStats = await dashboardData();
        setStats(fetchedStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);
  if (!stats) {
   return (
     <div className="flex justify-center h-full items-center py-20">
       <LoaderCircle className="animate-spin w-16 h-16" />
     </div>
   );
  }
  // Update statsItemData with the fetched stats
  const updatedStatsItemData = statsItemData.map((item) => {
    if (item.label === "Active Clients") item.number = stats.numOfClients;
    // if (item.label === "Total Protests") item.number = stats.numOfProspects;
    if (item.label === "New Prospects") item.number = stats.numOfProspects;
    // if (item.label === "Total Agents") item.number = stats.numOfAgents;
    return item;
  });

  return (
    <div className="flex w-full">
      <div className="flex gap-2 m-2 flex-col md:flex-row w-full  justify-between">
        {updatedStatsItemData.map((item) => (
          <StatsItem
            label={item.label}
            icon={item.icon}
            number={item.number}
            desc={item.desc}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

const StatsItem: React.FC<StatsItemProps> = ({
  label,
  icon,
  number,
  link,
}) => {
  return (
    <div className="bg-white w-full flex border rounded-xl justify-between">
      <NavLink to={link} className="w-full">
        <div className="flex md:flex-row gap-4 p-4 rounded-xl justify-between">
          <div className="">
            <h2 className="text-2xl font-bold">{number}</h2>
            <h1 className="text-sm">{label}</h1>
          </div>
          <div className="">
            <img src={icon} alt="" />
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default DashboardStats;
