import { useEffect, useState, useRef } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
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
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [archived, setArchived] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchRef = useRef(debouncedSearch);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      debounceRef.current = null;
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

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

  const fetchProperties = async (opts?: { limit?: number; offset?: number; search?: string }) => {
    const l = opts?.limit ?? limit;
    let o = opts?.offset ?? offset;
    const search = opts?.search !== undefined ? opts.search : debouncedSearch;
    if (search !== lastSearchRef.current) {
      lastSearchRef.current = search;
      o = 0;
      setOffset(0);
    }
    try {
      setLoading(true);
      setError(null);
      const res = archived
        ? await getArchiveProperties(l, o, search || undefined)
        : await getProperties(l, o, search || undefined);
      setProperties((res.data ?? []) as TData[]);
      setTotal(res.total);
      setLimit(res.limit);
      setOffset(res.offset);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(
        archived
          ? "Failed to load archived properties. Please try again later."
          : "Failed to load active properties. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties({ limit, offset, search: debouncedSearch });
  }, [archived, limit, offset, debouncedSearch]);

  const switchArchived = () => {
    setArchived((a) => !a);
    setOffset(0);
  };

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
          onClick={() => fetchProperties()}
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
          <h2 className="text-2xl font-bold">{total}</h2>
          <h3>{archived ? "Archived Properties" : "Active Properties"}</h3>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-semibold">Quick Search Properties</h1>
          <Input
            placeholder="Search by property ID, account number, or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
        <div className="flex gap-2 w-full">
          <Button onClick={switchArchived}>
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
        serverPagination={{
          total,
          limit,
          offset,
          hasMore,
          onPrev: () => setOffset((o) => Math.max(0, o - limit)),
          onNext: () => setOffset((o) => o + limit),
          onPageSizeChange: (size) => {
            setLimit(size);
            setOffset(0);
          },
        }}
      />
    </div>
  );
};

export default PropertiesTable;
