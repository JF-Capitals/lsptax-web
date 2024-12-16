"use client";

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

import React, { useEffect, useState } from "react";
import { getAgents } from "@/store/data";
import TableBuilder from "../../TableBuilder";

interface AgentTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const AgentTable = <TData, TValue>({
  columns,
}: AgentTableProps<TData, TValue>) => {
    const [agents, setAgents] = useState<TData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
    useEffect(() => {
      // Fetch properties data when the component mounts
      const fetchAgents = async () => {
        const data = await getAgents(); // Call your data-fetching function
        setAgents(data); // Set the fetched data into the state
      };

      fetchAgents();
    }, []);

  const table = useReactTable({
    data:agents,
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
        {/* <div className="flex flex-col p-4 w-full">
          <h1>Quick search a Client</h1>

          <Input
            placeholder="Search Client Name..."
            value={
              (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("clientName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div> */}

        <div className="w-full">
          <h2 className="text-2xl font-bold ">{agents.length}</h2>
          <h3>Total number of Contracts</h3>
        </div>
        {/* <div className="w-full">
          <h2>Filter Clients</h2>
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
                  All Clients
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
        </div> */}
        {/* <NavLink to={`/portal/clients/add-client`}>
          <Button className="w-full">Add New Client</Button>
        </NavLink> */}
      </div>
      <TableBuilder data={agents} columns={columns} label="Agents" />
    </div>
  );
};

export default AgentTable;
