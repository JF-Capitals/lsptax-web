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

import { Button } from "@/components/ui/button";
import {
  getProperties,
  getArchiveProperties,
  downloadPropertiesCSV,
} from "@/store/data"; // Import both data-fetching functions
import TableBuilder from "../TableBuilder";
import { Archive, Download, LoaderCircle } from "lucide-react";
import { Properties } from "./columns";
import { Input } from "@/components/ui/input";

interface PropertiesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const PropertiesTable = <TData extends Properties, TValue>({
  columns,
}: PropertiesTableProps<TData, TValue>) => {
  const [properties, setProperties] = useState<TData[]>([]);
  const [archived, setArchived] = useState(false); // Track if viewing archived properties
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const handleCsvDownload = async () => {
    setDownloadingCsv(true);
    try {
      await downloadPropertiesCSV();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setError("Failed to download CSV. Please try again later.");
    } finally {
      setDownloadingCsv(false);
    }
  };
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching
        const data = archived
          ? await getArchiveProperties() // Fetch archived properties if in archived mode
          : await getProperties(); // Fetch active properties otherwise
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(
          archived
            ? "Failed to load archived properties. Please try again later."
            : "Failed to load active properties. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [archived]); // Refetch data when switching between archived and active properties

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center h-96 items-center py-20">
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
          onClick={() => setArchived(!archived)}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      <div className="flex flex-col md:flex-row border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold">{properties.length}</h2>
          <h3>{archived ? "Archived Properties" : "Active Properties"}</h3>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1>Quick search a Property</h1>
          <Input
            placeholder="Search Property Name..."
            value={
              (table
                .getColumn("propertyAccount")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("propertyAccount")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2 w-full">
          <Button onClick={() => setArchived(!archived)}>
            <Archive />
            {archived ? "View Active" : "View Archived"}
          </Button>
          <Button onClick={handleCsvDownload} disabled={downloadingCsv}>
            {downloadingCsv ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Download />
            )}
          </Button>
        </div>
      </div>
      <TableBuilder
        data={properties}
        columns={columns}
        label={archived ? "Archived Properties" : "All Properties"}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default PropertiesTable;
