import React, { useEffect, useState } from "react";
import clientsLogo from "@/assets/dashboard/client-logo.svg";
import protestLogo from "@/assets/dashboard/protest-logo.svg";
import prospectLogo from "@/assets/dashboard/prospects-logo.svg";
import agentsLogo from "@/assets/dashboard/agents-logo.svg";
import { dashboardData } from "@/store/data";




const statsItemData = [
  {
    label: "Active Clients",
    icon: clientsLogo,
    number: 250,
    desc: "",
  },
  {
    label: "Total Protests",
    icon: protestLogo,
    number: 100,
    desc: "",
  },
  {
    label: "New Prospects",
    icon: prospectLogo,
    number: 10,
    desc: "",
  },
  {
    label: "Total Agents",
    icon: agentsLogo,
    number: 10,
    desc: "",
  },
];

interface StatsItemProps {
  label: string;
  icon: string;
  number: number;
  desc?: string;
}
interface Stats {
  numOfClients: number ;
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
    return <div>Loading...</div>;
  }
  // Update statsItemData with the fetched stats
  const updatedStatsItemData = statsItemData.map((item) => {
    if (item.label === "Active Clients") item.number = stats.numOfClients;
    if (item.label === "Total Protests") item.number = stats.numOfProspects;
    if (item.label === "New Prospects") item.number = stats.numOfProspects;
    if (item.label === "Total Agents") item.number = stats.numOfAgents;
    return item;
  });

  return (
    <div className="flex gap-2 w-full m-2 mt-4 ">
      {updatedStatsItemData.map((item) => (
        <StatsItem
          label={item.label}
          icon={item.icon}
          number={item.number}
          desc={item.desc}
        />
      ))}
    </div>
  );
};

const StatsItem: React.FC<StatsItemProps> = ({ label, icon, number, desc }) => {
  return (
    <div className="bg-white h-max w-full">
      <div className="border flex justify-between p-8 rounded-xl">
        <div className="">
          <h2 className="text-2xl font-bold">{number}</h2>
          <h1 className="text-sm">{label}</h1>
        </div>
        <div><img src={icon} alt="" /></div>
      </div>
      <div>{desc}</div>
    </div>
  );
};

export default DashboardStats;
