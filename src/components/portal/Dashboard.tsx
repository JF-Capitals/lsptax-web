import DashboardStats from "./dashboard/DashboardStats";
import MiniTableContainer from "./dashboard/mini-tables/MiniTableContainer";
import { useEffect, useState } from "react";
import { Properties } from "./properties/columns";
import { getClients, getProperties, getProspects } from "@/store/data";
import { Clients } from "./clients/list/columns";
import { Prospect } from "@/types/types";
import { dashboardData } from "@/store/data";
import { LoaderCircle } from "lucide-react";

interface Stats {
  numOfClients: number;
  numOfProspects: number;
}

const Dashboard = () => {
  const [propData, setPropData] = useState<Properties | null>(null);
  const [clientData, setClientData] = useState<Clients | null>(null);
  const [prospectData, setProspectData] = useState<Prospect | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true); // ✅ loading state added

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // start loading
        const [
          fetchedPropData,
          fetchedClientData,
          fetchedProspectData,
          dashboardStats,
        ] = await Promise.all([
          getProperties(),
          getClients(),
          getProspects(),
          dashboardData(),
        ]);
        setPropData(fetchedPropData);
        setClientData(fetchedClientData);
        setProspectData(fetchedProspectData);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <DashboardStats
        stats={stats ?? { numOfClients: 0, numOfProspects: 0 }}
        loading={loading}
      />
      {loading ? (
        <div className="flex justify-center h-full items-center py-20">
          <LoaderCircle className="animate-spin w-16 h-16" />
        </div>
      ) : (
        <MiniTableContainer
          prospectData={prospectData!}
          propData={propData!}
          clientData={clientData!}
        />
      )}
    </div>
  );
};

export default Dashboard;
