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
import { getContracts } from "@/store/data";
import TableBuilder from "../../TableBuilder";
import { LoaderCircle } from "lucide-react";

interface ContractTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ContractTable = <TData, TValue>({
  columns
}: ContractTableProps<TData, TValue>) => {
  const [contracts, setContracts] = useState<TData[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  // const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [columnVisibility, setColumnVisibility] =
  //   React.useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    // Fetch properties data when the component mounts
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await getContracts(); // Call your data-fetching function
        setContracts(data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later."); // Set the error state
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // const table = useReactTable({
  //   data:contracts,
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
          <h2 className="text-2xl font-bold ">{contracts.length}</h2>
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
      <TableBuilder data={contracts} columns={columns} label="Contracts" />
    </div>
  );
};

export default ContractTable;
