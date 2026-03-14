import DashboardStats from "./dashboard/DashboardStats";
import MiniTableContainer from "./dashboard/mini-tables/MiniTableContainer";
import { useDashboardDataQuery } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Properties } from "./properties/columns";
import { Clients } from "./clients/list/columns";
import { Prospect } from "@/types/types";
import { TableSkeleton } from "./TableSkeleton";

const Dashboard = () => {
  const {
    stats,
    propData,
    clientData,
    prospectData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardDataQuery();

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-destructive">
        <span className="text-lg font-semibold">
          {error instanceof Error ? error.message : "Failed to load dashboard"}
        </span>
        <Button variant="blue" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <DashboardStats
          stats={{ numOfClients: 0, numOfProspects: 0 }}
          loading={true}
        />
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardStats
        stats={stats}
        loading={false}
      />
      <MiniTableContainer
        prospectData={(prospectData ?? []) as Prospect[]}
        propData={(propData ?? []) as Properties[]}
        clientData={(clientData ?? []) as Clients[]}
      />
    </div>
  );
};

export default Dashboard;
