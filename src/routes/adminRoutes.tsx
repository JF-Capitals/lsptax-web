// adminRoutes.tsx
import { Routes, Route } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
import PropertiesTable from "@/components/portal/properties/PropertiesTable";
import InvoicesTable from "@/components/portal/invoices/InvoicesTable";
import ContractTable from "@/components/portal/forms/contracts/ContractsTable";
import ClientTable from "@/components/portal/clients/list/ClientTable";
import AgentTable from "@/components/portal/forms/agent/AgentsTable";
import ProspectTable from "@/components/portal/prospects/list/ProspectsTable";
import Dashboard from "@/components/portal/Dashboard";
import { propertiesColumn } from "@/components/portal/properties/columns";
import { invoicesColumn } from "@/components/portal/invoices/columns";
import { contractsColumn } from "@/components/portal/forms/contracts/columns";
import { clientsColumn } from "@/components/portal/clients/list/columns";
import { agentsColumn } from "@/components/portal/forms/agent/columns";
import { prospectColumn } from "@/components/portal/prospects/list/columns";
import { sampleInvoices } from "@/components/portal/invoices/dummy";
import { sampleAgents } from "@/components/portal/forms/agent/dummy";
import { sampleProspects } from "@/components/portal/prospects/list/dummy";
import AddClient from "@/components/portal/clients/add/AddClient";
import ContractOwnerTable from "@/components/portal/contract-owner/ContractOwnersTable";
import { contractOwnerColumns } from "@/components/portal/contract-owner/columns";
import { sampleContractOwners } from "@/components/portal/contract-owner/dummy";
import AddProspect from "@/components/portal/prospects/add/AddProspects";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* <Route element={<PrivateRoute />}> */}
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/properties"
        element={
          <PropertiesTable columns={propertiesColumn}/>
        }
      />
      <Route
        path="/invoices"
        element={
          <InvoicesTable columns={invoicesColumn} data={sampleInvoices} />
        }
      />
      <Route
        path="/contract-owner"
        element={
          <ContractOwnerTable
            columns={contractOwnerColumns}
            data={sampleContractOwners}
          />
        }
      />
      <Route
        path="/forms/contract"
        element={
          <ContractTable columns={contractsColumn} data={sampleAgents} />
        }
      />
      <Route
        path="/clients/list-client"
        element={<ClientTable columns={clientsColumn}/>}
      />
      <Route path="/clients/add-client" element={<AddClient />} />
      <Route path="/prospects/add-prospect" element={<AddProspect />} />
      <Route
        path="/forms/agent"
        element={<AgentTable columns={agentsColumn} data={sampleAgents} />}
      />
      <Route
        path="/prospects/list-prospect"
        element={
          <ProspectTable columns={prospectColumn} data={sampleProspects} />
        }
      />

      {/* </Route> */}
    </Routes>
  );
};

export default AdminRoutes;
