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

interface ContractOwnerTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ContractOwnerTable = <TData, TValue>({
  columns,
}: ContractOwnerTableProps<TData, TValue>) => {
  const [contractOwners, setContractOwners] = useState<TData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
    useEffect(() => {
      // Fetch properties data when the component mounts
      const fetchContractOwners = async () => {
        const data = await getContractOwner(); // Call your data-fetching function
        setContractOwners(data); // Set the fetched data into the state
      };

      fetchContractOwners();
    }, []);

  const table = useReactTable({
    data:contractOwners,
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
