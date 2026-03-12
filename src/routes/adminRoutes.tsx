import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";

import { propertiesColumn } from "@/components/portal/properties/columns";
import { invoicesColumn } from "@/components/portal/invoices/columns";
import { clientsColumn } from "@/components/portal/clients/list/columns";

const Dashboard = lazy(() => import("@/components/portal/Dashboard"));
const PropertiesTable = lazy(() => import("@/components/portal/properties/PropertiesTable"));
const PropertyForm = lazy(() => import("@/components/portal/properties/add/PropertyForm"));
const ViewProperty = lazy(() => import("@/components/portal/properties/view/ViewProperty"));
const EditProperty = lazy(() => import("@/components/portal/properties/edit/EditProperty"));
const InvoicesTable = lazy(() => import("@/components/portal/invoices/InvoicesTable"));
const ClientTable = lazy(() => import("@/components/portal/clients/list/ClientTable"));
const AddClient = lazy(() => import("@/components/portal/clients/add/AddClient"));
const ClientPage = lazy(() => import("@/components/portal/clients/ClientPage"));
const EditClient = lazy(() => import("@/components/portal/clients/edit/EditClient"));
const AddProspect = lazy(() => import("@/components/portal/prospects/add/AddProspects"));
const ProspectTable = lazy(() => import("@/components/portal/prospects/list/ProspectsTable"));
const InvoicePage = lazy(() => import("@/components/portal/clients/invoice/InvoicePage"));
const MoveFromProspect = lazy(() => import("@/components/portal/clients/add/MoveFromProspect"));
const ContractForm = lazy(() => import("@/components/portal/clients/contract/ContractForm"));
const AppointmentForm = lazy(() => import("@/components/portal/properties/aoa/AppointmentForm"));
const PropertyAoaPage = lazy(() => import("@/components/portal/properties/aoa/PropertyAoaPage"));
const ProspectPage = lazy(() => import("@/components/portal/prospects/ProspectPage"));
const ProspectContractPage = lazy(() => import("@/components/portal/prospects/contract/ProspectContractPage"));
const AddProspectPropertyForm = lazy(() => import("@/components/portal/prospects/AddProspectProperty"));
const ProspectProspertyTable = lazy(() => import("@/components/portal/prospects/ProspectPropertyTable"));
const EditProspectProperty = lazy(() => import("@/components/portal/prospects/EditProspectProperty"));
const EditProspectDetails = lazy(() => import("@/components/portal/prospects/edit/EditProspectDetails"));
const PreviewSignedPdf = lazy(() => import("@/components/portal/prospects/preview/PreviewSignedPDF"));
const CsvUploadsPage = lazy(() => import("@/components/portal/csv/CsvUploadsPage"));

const AdminRoutes = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[200px]">Loading...</div>}>
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
        element={<InvoicesTable columns={invoicesColumn as ColumnDef<unknown, unknown>[]} />}
      />
      <Route
        path="/clients/list-client"
        element={<ClientTable columns={clientsColumn as ColumnDef<unknown, unknown>[]} />}
      />
      <Route path="/clients/add-client" element={<AddClient />} />
      <Route path="/move_to_client" element={<MoveFromProspect />} />
      <Route path="/client" element={<ClientPage />} />
      <Route path="/edit-client" element={<EditClient />} />
      <Route path="/prospects/add-prospect" element={<AddProspect />} />
      <Route path="/edit-prospect" element={<EditProspectDetails />} />
      <Route
        path="/edit-prospect-properties"
        element={<EditProspectProperty />}
      />
      <Route
        path="/prospects/list-prospect"
        element={<ProspectTable />}
      />

      <Route path="/prospect" element={<ProspectPage />} />
      <Route path="/prospect/contract" element={<ProspectContractPage />} />
      <Route path="/prospect/preview-docs" element={<PreviewSignedPdf />} />
      <Route path="/prospect/add-prospect" element={<AddProspect />} />
      <Route
        path="/prospect/add-property"
        element={<AddProspectPropertyForm />}
      />
      <Route path="/prospect/property" element={<ProspectProspertyTable />} />
      <Route path="/contract" element={<ContractForm />} />
      <Route path="/aoa" element={<PropertyAoaPage />} />
      <Route path="/agent" element={<AppointmentForm />} />
      <Route path="/invoice" element={<InvoicePage />} />
      <Route path="/csv-uploads" element={<CsvUploadsPage />} />
    </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
