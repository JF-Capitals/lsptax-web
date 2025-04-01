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

import {
  downloadProspectsCSV,
  getArchiveProspects,
  getProspects,
} from "@/store/data";
import TableBuilder from "../../TableBuilder";
import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, LoaderCircle, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProspectTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ProspectTable = <TData, TValue>({
  columns,
}: ProspectTableProps<TData, TValue>) => {
  const [prospects, setProspects] = useState<TData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archived, setArchived] = useState(false); // State to track archive view
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const handleCsvDownload = async () => {
    setDownloadingCsv(true);
    try {
      await downloadProspectsCSV();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setError("Failed to download CSV. Please try again later.");
    } finally {
      setDownloadingCsv(false);
    }
  };
  const fetchProspects = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state before fetching
      const data = archived
        ? await getArchiveProspects()
        : await getProspects();

      setProspects(data);
    } catch (err) {
      console.error("Error fetching prospects:", err);
      setError("Failed to load prospects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, [archived]);

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

  const handleFilterByStatus = (status: string) => {
    table.getColumn("status")?.setFilterValue(status || undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoaderCircle className="animate-spin w-16 h-16 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-red-500">
        <span className="text-lg font-semibold">{error}</span>
        <Button
          variant="blue"
          className="mt-4"
          onClick={() => {
            setError(null); // Reset error before retrying
            setLoading(true);
            fetchProspects();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="flex flex-col p-4 w-full">
          <h1>Quick search a Prospect</h1>
          <Input
            placeholder="Search Prospect Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold">{prospects.length}</h2>
          <h3>Total number of {archived ? "Archived" : "Active"} Prospects</h3>
        </div>
        <div>
          <Button
            onClick={() => setArchived((prev) => !prev)}
            className="flex items-center gap-2"
          >
            {archived ? "Show Active Prospects" : "Show Archived Prospects"}
          </Button>
        </div>

        <NavLink to={`/portal/prospect/add-prospect`}>
          <Button className="w-full">Add New Prospect</Button>
        </NavLink>
        <Button onClick={handleCsvDownload} disabled={downloadingCsv}>
          {downloadingCsv ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Download />
          )}
        </Button>
      </div>
      {/* Filter Dropdown */}
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filter by Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilterByStatus("")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterByStatus("NOT_CONTACTED")}
            >
              Not Contacted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterByStatus("CONTACTED")}>
              Contacted
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterByStatus("IN_PROGRESS")}
            >
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterByStatus("SIGNED")}>
              Signed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
