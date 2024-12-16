import DashboardStats from "./dashboard/DashboardStats";
import DonutChart from "./dashboard/Chart";

// const dashboardItem = [
//   { label: "Add Client", desc: "Add new client to the system", route:"/portal/clients/add-client" },
//   { label: "Properties", desc: "List of all properties added to system", route:"/portal/properties" },
//   { label: "Contract Owners", desc: "List of all contract added to system", route:"/portal/contract-owner" },
// ];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8">
      <DashboardStats />
      <DonutChart/>
    </div>
  );
};

export default Dashboard;
