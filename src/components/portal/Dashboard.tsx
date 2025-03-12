import DashboardStats from "./dashboard/DashboardStats";
import MiniTableContainer from "./dashboard/mini-tables/MiniTableContainer";
import { useEffect, useState } from "react";
import { Properties } from "./properties/columns";
import { getClients, getProperties, getProspects } from "@/store/data";
import { Clients } from "./clients/list/columns";
import { LoaderCircle } from "lucide-react";
import { Prospect } from "@/types/types";

const Dashboard = () => {
  const [propData, setPropData] = useState<Properties | null>(null);
  const [clientData, setClientData] = useState<Clients | null>(null);
  const [prospectData, setProspectData] = useState<Prospect | null>(null);
  useEffect(() => {
    // Fetch stats from dashboardData function
    const fetchData = async () => {
      try {
        const fetchedPropData = await getProperties();
        const fetchedClientData = await getClients();
        const fetchedProspectData = await getProspects();
        setPropData(fetchedPropData);
        setClientData(fetchedClientData);
        setProspectData(fetchedProspectData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchData();
  }, []);

  if (!propData || !clientData || !prospectData) {
    return (
      <div className="flex justify-center h-full items-center py-20">
        <LoaderCircle className="animate-spin w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardStats />
      <MiniTableContainer
        prospectData={prospectData}
        propData={propData}
        clientData={clientData}
      />
    </div>
  );
};

export default Dashboard;
