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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { getClients } from "@/store/data";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import TableBuilder from "../../TableBuilder";

interface ClientTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ClientTable = <TData, TValue>({
  columns,
}: ClientTableProps<TData, TValue>) => {
  const [clients, setClients] = useState<TData[]>([]);
  const [position, setPosition] = useState("bottom");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = useState({});
  // const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    // Fetch properties data when the component mounts
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await getClients(); // Call your data-fetching function
        setClients(data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later."); // Set the error state
      }
    };

    fetchClients();
  }, []); // Empty dependency array to fetch data only once when the component mounts
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
    onRowSelectionChange: getSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      // rowSelection,
    },
    manualPagination: false,
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
      <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="flex flex-col w-full">
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

        <div className="w-full">
          <h2 className="text-2xl font-bold ">{clients.length}</h2>
          <h3>Total number of Clients</h3>
        </div>
        <div className="w-full">
          <h2>Filter Clients</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {position} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="All Clients">
                  All Clients
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Filter 2">
                  Filter 2
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Filter 3">
                  Filter 3
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <NavLink to={`/portal/clients/add-client`}>
          <Button className="w-full">Add New Client</Button>
        </NavLink>
      </div>
      <TableBuilder data={clients} columns={columns} label="All Clients" />
    </div>
  );
};

export default ClientTable;
