"use client";

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

import { useEffect, useState } from "react";
import { getAgents } from "@/store/data";
import TableBuilder from "../../TableBuilder";
// import { Input } from "@/components/ui/input";

interface AgentTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const AgentTable = <TData, TValue>({
  columns,
}: AgentTableProps<TData, TValue>) => {
    const [agents, setAgents] = useState<TData[]>([]);
  // const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [columnVisibility, setColumnVisibility] =
    // React.useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = React.useState({});
    useEffect(() => {
      // Fetch properties data when the component mounts
      const fetchAgents = async () => {
        const data = await getAgents(); // Call your data-fetching function
        setAgents(data); // Set the fetched data into the state
      };

      fetchAgents();
    }, []);

  // const table = useReactTable({
  //   data:agents,
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
        {/* <div className="flex flex-col p-4 w-full">
          <h1>Quick search a Agent</h1>

          <Input
            placeholder="Search Owner Name..."
            value={
              (table
                .getColumn("propertyAccNumber")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("propertyAccNumber")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div> */}

        <div className="w-full">
          <h2 className="text-2xl font-bold ">{agents.length}</h2>
          <h3>Total number of Agents</h3>
        </div>
      </div>
      <TableBuilder data={agents} columns={columns} label="Agents" />
    </div>
  );
};

export default AgentTable;
