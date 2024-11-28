import { useState } from "react";
import SideMenu from "@/components/portal/SideMenu";
import ClientTable from "@/components/portal/Clients/ClientTable";
import Forms from "@/components/portal/Forms";
import Invoices from "@/components/portal/Invoices";
import Properties from "@/components/portal/Properties";
import Prospects from "@/components/portal/Prospects";
import { columns } from "../components/portal/Clients/columns";


const AdminPortal = () => {
  const [selectedOption, setSelectedOption] = useState("overview"); // Default page

  const renderContent = async () => {
    switch (selectedOption) {
      case "clients":
        return <ClientTable columns={columns} data={[]} />;
      case "forms":
        return <Forms />;
      case "invoices":
        return <Invoices />;
      case "properties":
        return <Properties />;
      case "prospects":
        return <Prospects />;
      default:
        return <h1>Select an option</h1>;
    }
  };

  return (
    <div className="flex ">
      <SideMenu onSelectOption={setSelectedOption} />
      <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
    </div>
  );
};

export default AdminPortal;
