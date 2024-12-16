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

import { getProspects } from "@/store/data";
import TableBuilder from "../../TableBuilder";

interface ProspectTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ProspectTable = <TData, TValue>({
  columns,
}: ProspectTableProps<TData, TValue>) => {
  const [prospects, setProspects] = useState<TData[]>([]); // Data state for properties
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const data = await getProspects(); // Call your data-fetching function
        setProspects(data); // Set the fetched data into the state
      } catch (err) {
        console.error("Error fetching prospects:", err);
        setError("Failed to load prospects. Please try again later."); // Set the error state
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchProspects();
  }, []);
  const table = useReactTable({
    data: prospects,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span>Loading...</span>
      </div>
    );
  }
  // Render error state
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
        {/* <div className="flex flex-col p-4 w-full">
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
        </div> */}

        <div className="w-full">
          <h2 className="text-2xl font-bold ">{prospects.length}</h2>
          <h3>Total number of Prospects</h3>
        </div>
        {/* <div className="w-full">
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
        </div> */}
        {/* <NavLink to={`/portal/clients/add-client`}>
          <Button className="w-full">Add New Client</Button>
        </NavLink> */}
      </div>
      <TableBuilder data={prospects} columns={columns} label="Prospects" />
    </div>
  );
};

export default ProspectTable;
