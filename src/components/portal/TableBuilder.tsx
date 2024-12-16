import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface TableBuilderProps {
  data: any;
  columns: any;
  label: string;
}

const TableBuilder = ({ data, columns,label }: TableBuilderProps) => {
     const [sorting, setSorting] = useState<SortingState>([]);
     const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
     const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
       {}
     );
     const [rowSelection, setRowSelection] = useState({});
     const [position, setPosition] = useState("bottom");
     const [pageSize, setPageSize] = useState(10);

     const table = useReactTable({
       data,
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
       manualPagination: false,
     });
  return (
    <div className="rounded-xl border m-4 bg-white p-4 h-max overflow-scroll">
      <div className="pb-8 flex justify-between">
        <h2 className="tet-2xl font-bold">{label }</h2>
        <div className="text-sm">
          Showing{" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {pageSize} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="25">25</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          per page
        </div>{" "}
      </div>
      <div
        className="max-h-[calc(100vh-200px)] overflow-auto scrollbar-custom"
        style={{ minHeight: "300px" }} // Optional, ensures table doesn't collapse when empty
      >
        <Table className="table-fixed">
          {/* Apply table-fixed class */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      header.id === "select" ? "" : "cursor-pointer select-none"
                    }
                    onClick={
                      header.id === "select"
                        ? undefined
                        : header.column.getToggleSortingHandler()
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.id !== "select" &&
                      ({
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ??
                        null)}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`min-h-[48px] ${
                    row.getIsSelected() ? "bg-muted" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        {/* <Pagination table={table}/> */}
      </div>
    </div>
  );
}

export default TableBuilder