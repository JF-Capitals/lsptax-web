import { useEffect, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadInvoicesCSV } from "@/store/data";
import TableBuilder from "../TableBuilder";
import { Archive, Download, LoaderCircle, Search, X } from "lucide-react";
import { useInvoicesQuery } from "@/hooks/queries";
import { TableSkeleton } from "../TableSkeleton";

interface InvoicesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const InvoicesTable = <TData, TValue>({
  columns,
}: InvoicesTableProps<TData, TValue>) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [archived, setArchived] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const { data, isLoading, isError, refetch } = useInvoicesQuery({
    limit,
    offset,
    search: debouncedSearch,
    archived,
  });

  const invoices = (data?.data ?? []) as TData[];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;

  const handleCsvDownload = async () => {
    setDownloadingCsv(true);
    try {
      await downloadInvoicesCSV();
    } catch (err) {
      console.error("Error downloading CSV:", err);
    } finally {
      setDownloadingCsv(false);
    }
  };

  const switchArchived = () => {
    setArchived((a) => !a);
    setOffset(0);
  };

  const clearSearch = () => setSearchTerm("");

  if (isLoading) {
    return (
      <>
        <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
          <div className="w-full">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-5 w-40 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="relative flex items-center">
            <div className="h-10 w-80 bg-muted animate-pulse rounded pl-10" />
          </div>
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
        <TableSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-destructive">
        <span className="text-lg font-semibold">
          Failed to load invoices. Please try again later.
        </span>
        <Button variant="blue" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold">{total}</h2>
          <h3>Total number of Invoices</h3>
        </div>

        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden />
          <Input
            type="text"
            placeholder="Search by client number or property/account number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 w-80"
            aria-label="Search invoices by client or property number"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 h-6 w-6 p-0"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button variant={"blue"} onClick={switchArchived}>
          <Archive />
          {archived ? "View Active Invoices" : "View Archive"}
        </Button>
        <Button onClick={handleCsvDownload} disabled={downloadingCsv}>
          {downloadingCsv ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Download />
          )}
        </Button>
      </div>
      <TableBuilder
        data={invoices}
        columns={columns}
        label="Invoices"
        emptyState={{
          title: "No invoices yet",
          description: "Invoices will appear here once you generate them for clients.",
          action: { label: "Go to clients", to: "/portal/clients/list-client" },
        }}
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

export default InvoicesTable;
