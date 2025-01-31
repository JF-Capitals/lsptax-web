import { Routes, Route } from "react-router-dom";

import Dashboard from "@/components/portal/Dashboard";
import PropertiesTable from "@/components/portal/properties/PropertiesTable";
import PropertyForm from "@/components/portal/properties/add/PropertyForm";
import ViewProperty from "@/components/portal/properties/view/ViewProperty";
import EditProperty from "@/components/portal/properties/edit/EditProperty";
import InvoicesTable from "@/components/portal/invoices/InvoicesTable";
import ContractOwnerTable from "@/components/portal/contract-owner/ContractOwnersTable";
import ContractTable from "@/components/portal/forms/contracts/ContractsTable";
import ClientTable from "@/components/portal/clients/list/ClientTable";
import AddClient from "@/components/portal/clients/add/AddClient";
import ClientPage from "@/components/portal/clients/ClientPage";
import EditClient from "@/components/portal/clients/edit/EditClient";
import AddProspect from "@/components/portal/prospects/add/AddProspects";
import AgentTable from "@/components/portal/forms/agent/AgentsTable";
import ProspectTable from "@/components/portal/prospects/list/ProspectsTable";
import AgentForm from "@/components/portal/forms/agent/AgentForm";
import ContractForm from "@/components/portal/forms/contracts/ContractForm";
import InvoicePage from "@/components/portal/clients/invoice/InvoicePage";
import { propertiesColumn } from "@/components/portal/properties/columns";
import { invoicesColumn } from "@/components/portal/invoices/columns";
import { contractOwnerColumns } from "@/components/portal/contract-owner/columns";
import { contractsColumn } from "@/components/portal/forms/contracts/columns";
import { clientsColumn } from "@/components/portal/clients/list/columns";
import { agentsColumn } from "@/components/portal/forms/agent/columns";
import { prospectColumn } from "@/components/portal/prospects/list/columns";
import ProtectedRoute from "@/utils/ProtectedRoute";

const AdminRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/properties"
          element={<PropertiesTable columns={propertiesColumn} />}
        />
        <Route path="/add-property" element={<PropertyForm />} />
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
        <Route path="/edit-client" element={<EditClient />} />
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
        <Route path="/contract" element={<ContractForm />} />
        <Route path="/invoice" element={<InvoicePage />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;
