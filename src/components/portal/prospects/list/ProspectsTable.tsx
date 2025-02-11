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

import { downloadProspectsCSV, getProspects } from "@/store/data";
import TableBuilder from "../../TableBuilder";
import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
        console.log({ data });
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
        <div className="flex flex-col p-4 w-full">
          <h1>Quick search a Prospect</h1>

          <Input
            placeholder="Search Client Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold ">{prospects.length}</h2>
          <h3>Total number of Prospects</h3>
        </div>

        <NavLink to={`/portal/prospect/add-prospect`}>
          <Button className="w-full">Add New Prospect</Button>
        </NavLink>
        <Button onClick={downloadProspectsCSV}>
          <Download />
        </Button>
      </div>
      <TableBuilder
        data={prospects}
        columns={columns}
        label="Prospects"
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default ProspectTable;
