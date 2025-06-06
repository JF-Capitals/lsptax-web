import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadClientsCSV, getClients } from "@/store/data";
import { getArchiveClients } from "@/store/data"; // Import the function
import { Archive, Download, LoaderCircle, UserRoundPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import TableBuilder from "../../TableBuilder";
import UploadCsvButton from "./uploadCSV";

interface ClientTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ClientTable = <TData, TValue>({
  columns,
}: ClientTableProps<TData, TValue>) => {
  const [clients, setClients] = useState<TData[]>([]);
  const [archived, setArchived] = useState(false); // State to track archive view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCsvDownload = async () => {
    setDownloadingCsv(true);
    try {
      await downloadClientsCSV();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setError("Failed to download CSV. Please try again later.");
    } finally {
      setDownloadingCsv(false);
    }
  };
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state before fetching
      const data = archived ? await getArchiveClients() : await getClients(); // Fetch archived or active clients
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError(
        archived
          ? "Failed to load archived clients. Please try again later."
          : "Failed to load active clients. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [archived]); // Refetch data when archive state changes

  if (loading) {
    return (
      <div className="flex justify-center h-full items-center py-20">
        <LoaderCircle className="animate-spin w-16 h-16 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-red-500">
        <span className="text-lg font-semibold">{error}</span>
        <Button variant="blue" className="mt-4" onClick={fetchClients}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold">{clients.length}</h2>
          <h3>{archived ? "Archived Clients" : "Active Clients"}</h3>
        </div>
        <div className="flex flex-col w-full gap-2">
          <h1>Quick search a Client</h1>
          <Input
            placeholder="Search Name or Client Number..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="w-full flex gap-2 justify-end">
          <Button variant={"blue"} onClick={() => setArchived((prev) => !prev)}>
            <Archive />
            {archived ? "View Active Clients" : "View Archive"}
          </Button>
          <NavLink to={`/portal/clients/add-client`}>
            <Button variant={"blue"}>
              <UserRoundPlus /> Add New Client
            </Button>
          </NavLink>
          <UploadCsvButton
            onSuccess={fetchClients}
            onError={() =>
              setError("Failed to upload CSV. Please try again later.")
            }
          />
          <Button onClick={handleCsvDownload} disabled={downloadingCsv}>
            {downloadingCsv ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Download />
            )}
          </Button>
        </div>
      </div>
      <TableBuilder
        data={clients.filter((client: any) => {
          const value = searchTerm.toLowerCase();
          return (
            client.clientName?.toLowerCase().includes(value) ||
            client.clientId?.toString().toLowerCase().includes(value)
          );
        })}
        columns={columns}
        label="Clients"
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default ClientTable;
