import DashboardStats from "./dashboard/DashboardStats";
import MiniTableContainer from "./dashboard/mini-tables/MiniTableContainer";
import { useEffect, useState } from "react";
import { Properties } from "./properties/columns";
import { getClients, getContractOwner, getProperties } from "@/store/data";
import { Clients } from "./clients/list/columns";
import { ContractOwner } from "./contract-owner/columns";
import { LoaderCircle } from "lucide-react";

const Dashboard = () => {
  const [propData, setPropData] = useState<Properties | null>(null);
  const [clientData, setClientData] = useState<Clients | null>(null);
  const [contractOwnersData, setContractOwnersData] = useState<ContractOwner>();
  useEffect(() => {
    // Fetch stats from dashboardData function
    const fetchData = async () => {
      try {
        const fetchedPropData = await getProperties();
        const fetchedClientData = await getClients();
        const fetchedContractOwnerData = await getContractOwner();
        setPropData(fetchedPropData);
        setClientData(fetchedClientData);
        setContractOwnersData(fetchedContractOwnerData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchData();
  }, []);

  if (!propData || !clientData || !contractOwnersData) {
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
        propData={propData}
        clientData={clientData}
        contractOwnersData={contractOwnersData}
      />
    </div>
  );
};

export default Dashboard;
