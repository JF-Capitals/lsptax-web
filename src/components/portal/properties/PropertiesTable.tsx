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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { getProperties } from "@/store/data"; // Import your data-fetching function
import { NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import TableBuilder from "../TableBuilder";
import { ChevronDown, LoaderCircle } from "lucide-react";

interface PropertiesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const PropertiesTable = <TData, TValue>({
  columns,
}: PropertiesTableProps<TData, TValue>) => {
  const [properties, setProperties] = useState<TData[]>([]); // Data state for properties
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  
  const [position, setPosition] = useState("bottom");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const data = await getProperties(); // Call your data-fetching function
        setProperties(data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later."); // Set the error state
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchProperties();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  const table = useReactTable({
    data: properties,
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
      <div className="flex justify-center h-full items-center py-20">
        <LoaderCircle className="animate-spin w-16 h-16" />
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
        <div className="flex flex-col w-full">
          <h1>Quick search a Property</h1>

          <Input
            placeholder="Search Property Name..."
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
          <h2 className="text-2xl font-bold ">{properties.length}</h2>
          <h3>Total number of Properties</h3>
        </div>
        <div className="w-full">
          <h2>Filter Properties</h2>
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
                  All Properties
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
        <NavLink to={`/portal/clients/add-properties`}>
          <Button className="w-full">Add New Property</Button>
        </NavLink>
      </div>
      <TableBuilder
        data={properties}
        columns={columns}
        label="All Properties"
      />
    </div>
  );
};

export default PropertiesTable;
