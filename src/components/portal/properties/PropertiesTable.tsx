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
import { getProperties, getArchiveProperties } from "@/store/data"; // Import both data-fetching functions
import TableBuilder from "../TableBuilder";
import { Archive, ChevronDown, HousePlus, LoaderCircle } from "lucide-react";
import { Properties } from "./columns";

interface PropertiesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const PropertiesTable = <TData extends Properties, TValue>({
  columns,
}: PropertiesTableProps<TData, TValue>) => {
  const [properties, setProperties] = useState<TData[]>([]);
  const [archived, setArchived] = useState(false); // Track if viewing archived properties
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("All Properties");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = archived
          ? await getArchiveProperties() // Fetch archived properties if in archived mode
          : await getProperties(); // Fetch active properties otherwise
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [archived]); // Refetch data when switching between archived and active properties

  // Filter properties based on the selected filter
  const filteredProperties = properties.filter((property) => {
    if (filter === "All Properties") {
      return true;
    }
    // Filter based on the 'type' field in the 'propertyDetails' object
    return (
      property?.propertyDetails?.type?.toLowerCase() === filter.toLowerCase()
    );
  });

  const table = useReactTable({
    data: filteredProperties,
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
    <div className="overflow-y-auto ">
      <div className="flex flex-col md:flex-row border rounded-xl items-center gap-4 bg-white m-4 p-4 border-red-100 ">
        <div className="w-full">
          <h2 className="text-2xl font-bold ">{filteredProperties.length}</h2>
          <h3>{archived ? "Archived Properties" : "Active Properties"}</h3>
        </div>
        {/* <div className="flex flex-col gap-2 w-full">
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
        </div> */}
        <div className="flex gap-2 w-full">
          <div className="w-full">
            <h2>Filter Properties</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {filter} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={filter}
                  onValueChange={setFilter}
                >
                  <DropdownMenuRadioItem value="All Properties">
                    All Properties
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Residential">
                    Residential
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Commercial">
                    Commercial
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            variant={"blue"}
            className=""
            onClick={() => setArchived(!archived)}
          >
            <Archive />
            {archived ? "View Active" : "View Archived"}
          </Button>

          {/* <NavLink to={`/portal/add-properties`}>
            <Button variant={"blue"} className="">
              <HousePlus />
              Add New Property
            </Button>
          </NavLink> */}
        </div>
      </div>
      <TableBuilder
        data={filteredProperties}
        columns={columns}
        label={archived ? "Archived Properties" : "All Properties"}
      />
    </div>
  );
};

export default PropertiesTable;
