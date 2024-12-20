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

import { getContractOwner } from "@/store/data";
import TableBuilder from "../TableBuilder";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";

interface ContractOwnerTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ContractOwnerTable = <TData, TValue>({
  columns,
}: ContractOwnerTableProps<TData, TValue>) => {
  const [contractOwners, setContractOwners] = useState<TData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    // Fetch properties data when the component mounts
    const fetchContractOwners = async () => {
       try {
         setLoading(true); // Set loading to true while fetching
         const data = await getContractOwner(); // Call your data-fetching function
         setContractOwners(data); // Set the fetched data into the state
       } catch (error) {
         console.error("Error fetching properties:", error);
         setError("Failed to load properties. Please try again later."); // Set the error state
       } finally {
         setLoading(false); // Set loading to false once fetching is done
       }
     };
  
    fetchContractOwners();
  }, []);

  const table = useReactTable({
    data: contractOwners,
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
    <div>
      <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="flex flex-col w-full">
          <h1>Quick search a Contract Owner</h1>

          <Input
            placeholder="Search Contract Owner..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="w-full">
          <h2 className="text-2xl font-bold ">{contractOwners.length}</h2>
          <h3>Total number of Contract Owners</h3>
        </div>
      </div>
      <TableBuilder
        data={contractOwners}
        columns={columns}
        label="Contract Owners"
      />
    </div>
  );
};

export default ContractOwnerTable;
