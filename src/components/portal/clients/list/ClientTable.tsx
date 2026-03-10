import { useEffect, useState, useRef } from "react";
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
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input (300ms) so we don't hit the API on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      debounceRef.current = null;
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const lastSearchRef = useRef(debouncedSearch);

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

  const fetchClients = async (opts?: { limit?: number; offset?: number; search?: string }) => {
    const l = opts?.limit ?? limit;
    let o = opts?.offset ?? offset;
    const search = opts?.search !== undefined ? opts.search : debouncedSearch;
    if (search !== lastSearchRef.current) {
      lastSearchRef.current = search;
      o = 0;
      setOffset(0);
    }
    try {
      setLoading(true);
      setError(null);
      const res = archived
        ? await getArchiveClients(l, o, search || undefined)
        : await getClients(l, o, search || undefined);
      setClients((res.data ?? []) as TData[]);
      setTotal(res.total);
      setLimit(res.limit);
      setOffset(res.offset);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error("Error fetching clients:", err);
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
    fetchClients({ limit, offset, search: debouncedSearch });
  }, [archived, limit, offset, debouncedSearch]);

  const switchArchived = () => {
    setArchived((a) => !a);
    setOffset(0);
  };

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
        <Button variant="blue" className="mt-4" onClick={() => fetchClients()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold">{total}</h2>
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
          <Button variant={"blue"} onClick={switchArchived}>
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
        data={clients}
        columns={columns}
        label="Clients"
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        serverPagination={{
          total,
          limit,
          offset,
          hasMore,
          onPrev: () => setOffset((o) => Math.max(0, o - limit)),
          onNext: () => setOffset((o) => o + limit),
          onPageSizeChange: (size) => {
            setLimit(size);
            setOffset(0);
          },
        }}
      />
    </div>
  );
};

export default ClientTable;
