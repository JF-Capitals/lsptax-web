import { useEffect, useRef, useState } from "react";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadClientsCSV } from "@/store/data";
import { Archive, Download, LoaderCircle, UserRoundPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import TableBuilder from "../../TableBuilder";
import { useClientsQuery } from "@/hooks/queries";
import { TableSkeleton } from "../../TableSkeleton";

interface ClientTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ClientTable = <TData, TValue>({
  columns,
}: ClientTableProps<TData, TValue>) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [archived, setArchived] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const { data, isLoading, isError, refetch } = useClientsQuery({
    limit,
    offset,
    search: debouncedSearch,
    archived,
  });

  const clients = (data?.data ?? []) as TData[];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;

  const handleCsvDownload = async () => {
    setDownloadingCsv(true);
    try {
      await downloadClientsCSV();
    } catch (err) {
      console.error("Error downloading CSV:", err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  const switchArchived = () => {
    setArchived((a) => !a);
    setOffset(0);
  };

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col md:flex-row border rounded-xl items-center gap-4 bg-white m-4 p-4">
          <div className="w-full">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-5 w-40 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="h-5 w-40 bg-muted animate-pulse rounded" />
            <div className="h-10 max-w-sm bg-muted animate-pulse rounded" />
          </div>
          <div className="w-full flex gap-2 justify-end">
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            <div className="h-10 w-36 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <TableSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-destructive">
        <span className="text-lg font-semibold">
          {archived
            ? "Failed to load archived clients. Please try again later."
            : "Failed to load active clients. Please try again later."}
        </span>
        <Button variant="blue" className="mt-4" onClick={() => refetch()}>
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
            aria-label="Search clients by name or client number"
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
        emptyState={{
          title: "No clients yet",
          description: "Get started by adding your first client to manage properties and invoices.",
          action: { label: "Add your first client", to: "/portal/clients/add-client" },
        }}
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
