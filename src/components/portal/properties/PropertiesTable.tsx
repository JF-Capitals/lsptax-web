import { useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProperties } from "@/store/data"; // Import your data-fetching function
import { data } from "react-router-dom";

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const data = await getProperties(); // Call your data-fetching function
        setProperties(data); // Set the fetched data into the state
      } catch (err) {
        console.error("Error fetching properties:", err);
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
    <>No Data Right Now</>
    // <div className="">
    //   <div className="flex items-center py-4">
    //     <Input
    //       placeholder="Filter properties..."
    //       value={
    //         (table.getColumn("propertyName")?.getFilterValue() as string) ?? ""
    //       }
    //       onChange={(event) =>
    //         table.getColumn("propertyName")?.setFilterValue(event.target.value)
    //       }
    //       className="max-w-sm"
    //     />
    //   </div>
    //   <div className="rounded-md border">
    //     <Table className="table-fixed">
    //       <TableHeader>
    //         {table.getHeaderGroups().map((headerGroup) => (
    //           <TableRow key={headerGroup.id}>
    //             {headerGroup.headers.map((header) => (
    //               <TableHead
    //                 key={header.id}
    //                 className={
    //                   header.id === "select" ? "" : "cursor-pointer select-none"
    //                 }
    //                 onClick={
    //                   header.id === "select"
    //                     ? undefined
    //                     : header.column.getToggleSortingHandler()
    //                 }
    //               >
    //                 {header.isPlaceholder
    //                   ? null
    //                   : flexRender(
    //                       header.column.columnDef.header,
    //                       header.getContext()
    //                     )}
    //                 {header.id !== "select" &&
    //                   ({
    //                     asc: " 🔼",
    //                     desc: " 🔽",
    //                   }[header.column.getIsSorted() as string] ??
    //                     null)}
    //               </TableHead>
    //             ))}
    //           </TableRow>
    //         ))}
    //       </TableHeader>
    //       <TableBody>
    //         {table.getRowModel().rows?.length ? (
    //           table.getRowModel().rows.map((row) => (
    //             <TableRow
    //               key={row.id}
    //               data-state={row.getIsSelected() && "selected"}
    //               className={`min-h-[48px] ${
    //                 row.getIsSelected() ? "bg-muted" : ""
    //               }`}
    //             >
    //               {row.getVisibleCells().map((cell) => (
    //                 <TableCell key={cell.id}>
    //                   {flexRender(
    //                     cell.column.columnDef.cell,
    //                     cell.getContext()
    //                   )}
    //                 </TableCell>
    //               ))}
    //             </TableRow>
    //           ))
    //         ) : (
    //           <TableRow>
    //             <TableCell
    //               colSpan={columns.length}
    //               className="h-24 text-center"
    //             >
    //               No results.
    //             </TableCell>
    //           </TableRow>
    //         )}
    //       </TableBody>
    //     </Table>
    //   </div>
    //   <div className="flex items-center justify-end space-x-2 py-4">
    //     <Button
    //       variant="outline"
    //       size="sm"
    //       onClick={() => table.previousPage()}
    //       disabled={!table.getCanPreviousPage()}
    //     >
    //       Previous
    //     </Button>
    //     <Button
    //       variant="outline"
    //       size="sm"
    //       onClick={() => table.nextPage()}
    //       disabled={!table.getCanNextPage()}
    //     >
    //       Next
    //     </Button>
    //   </div>
    // </div>
  );
};

export default PropertiesTable;
