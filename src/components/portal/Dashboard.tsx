import { NavLink } from "react-router-dom";

const dashboardItem = [
  { label: "Add Client", desc: "Add new client to the system", route:"/portal/clients/add-client" },
  { label: "Properties", desc: "List of all properties added to system", route:"/portal/properties" },
  { label: "Contract Owners", desc: "List of all contract added to system", route:"/portal/contract-owner" },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center h-full">
      {dashboardItem.map((item) => (
        <NavLink to={item.route}>
          <div className="bg-gray-100 border rounded-2xl text-black p-8">
            <h2>{item.label}</h2>
            <p>{item.desc}</p>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default Dashboard;
