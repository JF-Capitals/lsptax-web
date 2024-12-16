import { useEffect, useState } from "react";
import {
  ColumnDef,
  // SortingState,
  // getCoreRowModel,
  // useReactTable,
  // getSortedRowModel,
  // getPaginationRowModel,
  // ColumnFiltersState,
  // getFilteredRowModel,
  // VisibilityState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getInvoices } from "@/store/data";
import TableBuilder from "../TableBuilder";
import { ChevronDown } from "lucide-react";

interface InvoicesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const InvoicesTable = <TData, TValue>({
  columns,
}: InvoicesTableProps<TData, TValue>) => {
  const [invoices, setInvoices] = useState<TData[]>([]);
  const [filter, setFilter] = useState("completed");
  // const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [columnVisibility, setColumnVisibility] =
  //   useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    // Fetch properties data when the component mounts
  const fetchInvoices = async () => {
    const data = await getInvoices();
    const invoicesWithStatus = data.map((invoice: { status: any; }) => ({
      ...invoice,
      status: invoice.status || "1", // Default status
    }));
    setInvoices(invoicesWithStatus);
  };


    fetchInvoices();
  }, []);

  // const table = useReactTable({
  //   data:invoices,
  //   columns,
  //   onSortingChange: setSorting,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   onColumnFiltersChange: setColumnFilters,
  //   getFilteredRowModel: getFilteredRowModel(),
  //   onColumnVisibilityChange: setColumnVisibility,
  //   onRowSelectionChange: setRowSelection,
  //   state: {
  //     sorting,
  //     columnFilters,
  //     columnVisibility,
  //     rowSelection,
  //   },
  // });

  return (
    <div>
      <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold ">{invoices.length}</h2>
          <h3>Total number of Invoices</h3>
        </div>
        <div className="w-full">
          <h2>Filter Invoices</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filter} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
                <DropdownMenuRadioItem value="Completed">
                  Completed
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pending">
                  Pending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TableBuilder data={invoices} columns={columns} label="Invoices" />
    </div>
  );
};

export default InvoicesTable;
