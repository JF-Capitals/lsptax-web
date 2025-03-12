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
import {
  Download,
  // ChevronDown
} from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"; // Import dropdown components

// enum ProspectStatus {
//   NOT_CONTACTED = "NOT_CONTACTED",
//   CONTACTED = "CONTACTED",
//   IN_PROGRESS = "IN_PROGRESS",
//   SIGNED = "SIGNED",
// }

// interface Prospect {
//   id: string;
//   name: string;
//   status: ProspectStatus;
// }

interface ProspectTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ProspectTable = <TData, TValue>({
  columns,
}: ProspectTableProps<TData, TValue>) => {
  const [prospects, setProspects] = useState<TData[]>([]); // const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [selectedStatus, setSelectedStatus] = useState<ProspectStatus | null>(
  //   null
  // );

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        setLoading(true);
        const data = await getProspects();
        setProspects(data);
        // setFilteredProspects(data); // Initially, show all prospects
      } catch (err) {
        console.error("Error fetching prospects:", err);
        setError("Failed to load prospects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []);

  // useEffect(() => {
  //   if (selectedStatus) {
  //     setFilteredProspects(
  //       prospects.filter((p) => p.status === selectedStatus)
  //     );
  //   } else {
  //     setFilteredProspects(prospects); // Ensure it stays an array of `Prospect`
  //   }
  // }, [selectedStatus, prospects]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span>Loading...</span>
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

        {/* Status Filter Dropdown
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedStatus ? selectedStatus : "Filter by Status"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
              All
            </DropdownMenuItem>
            {Object.values(ProspectStatus).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}

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
