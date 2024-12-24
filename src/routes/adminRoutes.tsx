// adminRoutes.tsx
import { Routes, Route } from "react-router-dom";
// import PropertiesTable from "@/components/portal/properties/PropertiesTable";
import InvoicesTable from "@/components/portal/invoices/InvoicesTable";
import ContractTable from "@/components/portal/forms/contracts/ContractsTable";
import ClientTable from "@/components/portal/clients/list/ClientTable";
import AgentTable from "@/components/portal/forms/agent/AgentsTable";
import ProspectTable from "@/components/portal/prospects/list/ProspectsTable";
import Dashboard from "@/components/portal/Dashboard";
// import { propertiesColumn } from "@/components/portal/properties/columns";
import { invoicesColumn } from "@/components/portal/invoices/columns";
import { contractsColumn } from "@/components/portal/forms/contracts/columns";
import { clientsColumn } from "@/components/portal/clients/list/columns";
import { agentsColumn } from "@/components/portal/forms/agent/columns";
import { prospectColumn } from "@/components/portal/prospects/list/columns";
import AddClient from "@/components/portal/clients/add/AddClient";
import ContractOwnerTable from "@/components/portal/contract-owner/ContractOwnersTable";
import { contractOwnerColumns } from "@/components/portal/contract-owner/columns";
import AddProspect from "@/components/portal/prospects/add/AddProspects";
import PropertiesTable from "@/components/portal/properties/PropertiesTable";
import { propertiesColumn } from "@/components/portal/properties/columns";
import PropertyForm from "@/components/portal/properties/add/PropertyForm";
import EditProperty from "@/components/portal/properties/edit/EditProperty";
import ViewProperty from "@/components/portal/properties/view/ViewProperty";
import AgentForm from "@/components/portal/forms/agent/AgentForm";
import ClientPage  from "@/components/portal/clients/ClientPage";
import ContractForm from "@/components/portal/forms/contracts/ContractForm";


const AdminRoutes = () => {
  return (
    <Routes>
      {/* <Route element={<PrivateRoute />}> */}
      <Route path="/*" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/properties"
        element={<PropertiesTable columns={propertiesColumn} />}
      />
      <Route path="/add-properties" element={<PropertyForm />} />
      <Route path="/property" element={<ViewProperty />} />
      <Route path="/edit-properties" element={<EditProperty />} />
      <Route
        path="/invoices"
        element={<InvoicesTable columns={invoicesColumn} />}
      />
      <Route
        path="/contract-owner"
        element={<ContractOwnerTable columns={contractOwnerColumns} />}
      />
      <Route
        path="/forms/contract"
        element={<ContractTable columns={contractsColumn} />}
      />
      <Route
        path="/clients/list-client"
        element={<ClientTable columns={clientsColumn} />}
      />
      <Route path="/clients/add-client" element={<AddClient />} />
      <Route path="/client" element={<ClientPage />} />
      <Route path="/prospects/add-prospect" element={<AddProspect />} />
      <Route
        path="/forms/agent"
        element={<AgentTable columns={agentsColumn} />}
      />
      <Route
        path="/prospects/list-prospect"
        element={<ProspectTable columns={prospectColumn} />}
      />
      <Route path="/agent-form" element={<AgentForm />} />
      <Route path="/contract-form" element={<ContractForm />} />

      {/* </Route> */}
    </Routes>
  );
};

export default AdminRoutes;
