import { useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { getClients } from "@/store/data";
import { getArchiveClients } from "@/store/data"; // Import the function
import { Archive, LoaderCircle, UserRoundPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import TableBuilder from "../../TableBuilder";

interface ContractTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ContractTable = <TData, TValue>({
  columns,
}: ContractTableProps<TData, TValue>) => {
  const [clients, setClients] = useState<TData[]>([]);
  const [archived, setArchived] = useState(false); // State to track archive view
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = archived ? await getArchiveClients() : await getClients(); // Fetch archived or active clients
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError("Failed to load clients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [archived]); // Refetch data when archive state changes
  const table = useReactTable({
    data: clients,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center h-full items-center py-20">
        <LoaderCircle className="animate-spin w-16 h-16" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        <span>{error}</span>
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
            placeholder="Search Client Name..."
            value={
              (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("clientName")?.setFilterValue(event.target.value)
            }
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
              {" "}
              <UserRoundPlus /> Add New Client
            </Button>
          </NavLink>
        </div>
      </div>
      <TableBuilder data={clients} columns={columns} label="Clients" columnFilters={columnFilters} setColumnFilters={setColumnFilters}  />
    </div>
  );
};

export default ContractTable;
