import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { downloadInvoicesCSV } from "@/store/data";
import TableBuilder from "../TableBuilder";
import { Archive, Download, LoaderCircle, Mail, Search, X } from "lucide-react";
import { useInvoicesQuery } from "@/hooks/queries";
import { TableSkeleton } from "../TableSkeleton";
import { routes } from "@/routes/ROUTES";
import { BulkInvoiceSendDialog } from "./BulkInvoiceSendDialog";
import type { InvoiceSummary } from "@/types/types";

interface InvoicesTableProps {
  columns: ColumnDef<InvoiceSummary>[];
}

const InvoicesTable = ({
  columns,
}: InvoicesTableProps) => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [archived, setArchived] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [bulkSendOpen, setBulkSendOpen] = useState(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<number>>(new Set());

  const commitSearch = () => {
    setAppliedSearch(searchTerm.trim());
    setOffset(0);
  };

  const { data, isLoading, isError, refetch } = useInvoicesQuery({
    limit,
    offset,
    search: appliedSearch,
    archived,
  });

  const invoices = (data?.data ?? []) as InvoiceSummary[];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;
  const currentPageInvoiceIds = useMemo(
    () =>
      invoices
        .map((invoice) => Number(invoice.id))
        .filter((id) => Number.isFinite(id)),
    [invoices]
  );
  const selectedInvoiceIdList = useMemo(
    () => Array.from(selectedInvoiceIds),
    [selectedInvoiceIds]
  );
  const currentPageSelectedCount = currentPageInvoiceIds.filter((id) =>
    selectedInvoiceIds.has(id)
  ).length;
  const allCurrentPageSelected =
    currentPageInvoiceIds.length > 0 &&
    currentPageSelectedCount === currentPageInvoiceIds.length;

  const toggleInvoiceSelection = (invoiceId: string | number, checked: boolean) => {
    const numericId = Number(invoiceId);
    if (!Number.isFinite(numericId)) return;

    setSelectedInvoiceIds((current) => {
      const next = new Set(current);
      if (checked) next.add(numericId);
      else next.delete(numericId);
      return next;
    });
  };

  const toggleCurrentPageSelection = (checked: boolean) => {
    setSelectedInvoiceIds((current) => {
      const next = new Set(current);
      currentPageInvoiceIds.forEach((id) => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const columnsWithSelection = useMemo<ColumnDef<InvoiceSummary>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <div onClick={(event) => event.stopPropagation()}>
            <Checkbox
              checked={
                allCurrentPageSelected
                  ? true
                  : currentPageSelectedCount > 0
                    ? "indeterminate"
                    : false
              }
              onCheckedChange={(checked) => toggleCurrentPageSelection(checked === true)}
              aria-label="Select all invoices on this page"
            />
          </div>
        ),
        cell: ({ row }) => {
          const invoiceId = Number(row.original.id);
          const isSelected = Number.isFinite(invoiceId) && selectedInvoiceIds.has(invoiceId);

          return (
            <div onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => toggleInvoiceSelection(row.original.id, checked === true)}
                aria-label={`Select invoice ${row.original.id}`}
              />
            </div>
          );
        },
        enableSorting: false,
      },
      ...columns,
    ],
    [allCurrentPageSelected, columns, currentPageSelectedCount, selectedInvoiceIds]
  );

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
    setSelectedInvoiceIds(new Set());
  };

  const clearSearch = () => {
    setSearchTerm("");
    setAppliedSearch("");
    setOffset(0);
  };

  if (isLoading) {
    return (
      <>
        <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
          <div className="w-full">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-5 w-40 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 flex-1 max-w-md w-80 bg-muted animate-pulse rounded" />
            <div className="h-10 w-10 bg-muted animate-pulse rounded shrink-0" />
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
      <div className="flex flex-col justify-center items-center py-20 gap-2">
        <Button variant="blue" onClick={() => refetch()}>
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

        <div className="flex items-center gap-2">
          <div className="relative flex flex-1 items-center max-w-md w-80 min-w-0">
            <Input
              type="text"
              placeholder="Search by property/account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitSearch();
                }
              }}
              className="pr-9 w-full"
              aria-label="Search invoices by property/account number"
            />
            {(searchTerm || appliedSearch) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 h-7 w-7 p-0"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={commitSearch}
            aria-label="Run search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Button variant={"blue"} onClick={switchArchived}>
          <Archive />
          {archived ? "View Active Invoices" : "View Archive"}
        </Button>
        {!archived && (
          <Button variant="blue" onClick={() => setBulkSendOpen(true)}>
            <Mail />
            {selectedInvoiceIdList.length > 0
              ? `Bulk Send Selected (${selectedInvoiceIdList.length})`
              : "Bulk Send"}
          </Button>
        )}
        {selectedInvoiceIdList.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedInvoiceIds(new Set())}
          >
            Clear Selection
          </Button>
        )}
        <Button onClick={handleCsvDownload} disabled={downloadingCsv}>
          {downloadingCsv ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Download />
          )}
        </Button>
      </div>
      <BulkInvoiceSendDialog
        open={bulkSendOpen}
        onOpenChange={setBulkSendOpen}
        filters={
          selectedInvoiceIdList.length > 0
            ? { invoiceIds: selectedInvoiceIdList }
            : {
                search: searchTerm.trim() || appliedSearch || undefined,
                paymentStatus: "unpaid",
              }
        }
        onSent={() => {
          setSelectedInvoiceIds(new Set());
          void refetch();
        }}
      />
      <TableBuilder
        data={invoices}
        columns={columnsWithSelection}
        label="Invoices"
        emptyState={{
          title: "No invoices yet",
          description: "Invoices will appear here once you generate them for clients.",
          action: { label: "Go to clients", to: routes.clients.list() },
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
