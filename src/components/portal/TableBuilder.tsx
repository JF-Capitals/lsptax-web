import { useState } from "react";
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
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableBuilderProps {
  data: any;
  columns: any;
  label: string;
}

const TableBuilder = ({ data, columns, label }: TableBuilderProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(10);
  // const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [pageIndex, setPageIndex] = useState(0); // Add a pageIndex state

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
      pagination: {
        pageSize,
        pageIndex, // Set the pageIndex in the state
      },
    },
    manualPagination: false,
  });

  // Update the table's page size whenever it changes
  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPageIndex(0); // Reset to first page when page size changes
    table.setPageSize(value);
  };

  return (
    <div className="rounded-xl border m-4 bg-white p-4 flex flex-col overflow-y-auto h-[calc(100vh-230px)] ">
      <div className="pb-8 flex justify-between">
        <h2 className="text-2xl font-bold">{label}</h2>
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
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="25">25</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>{" "}
          per page
        </div>
      </div>

      <div className="overflow-auto scrollbar-custom flex-1">
        <div className="overflow-x-auto h-full">
          <Table className="table-auto min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={`cursor-pointer select-none ${
                        index > 1 ? "hidden md:table-cell" : ""
                      } text-gray-700 font-semibold`}
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
                          asc: <ChevronUp />,
                          desc: <ChevronDown />,
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
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={index > 1 ? "hidden sm:table-cell" : ""}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {/* <TableCell className="sm:hidden">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRow(row.original)}
                          >
                            See More
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Row Details</DialogTitle>
                          </DialogHeader>
                          <div className="p-4">
                            {selectedRow &&
                              Object.entries(selectedRow).map(([key]) => (
                                <div
                                  key={key}
                                  className="flex justify-between py-2"
                                >
                                  <span className="font-medium">{key}:</span>
                                  <span>{selectedRow[key]}</span>{" "}
                                </div>
                              ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-start space-x-2 py-4">
        <Button
          variant={"blue"}
          size="sm"
          onClick={() => {
            setPageIndex((old) => Math.max(old - 1, 0)); // Go to the previous page
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant={"blue"}
          size="sm"
          onClick={() => {
            setPageIndex((old) => old + 1); // Go to the next page
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TableBuilder;