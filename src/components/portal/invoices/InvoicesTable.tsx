import { useMemo, useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { downloadInvoicesCSV } from "@/store/data";
import { MAX_API_PAGE_SIZE } from "@/store/common";
import TableBuilder from "../TableBuilder";
import { Archive, Download, FileArchive, LoaderCircle, Mail, RefreshCw, Search, X } from "lucide-react";
import { useInvoicesQuery } from "@/hooks/queries";
import { TableSkeleton } from "../TableSkeleton";
import { routes } from "@/routes/ROUTES";
import { BulkInvoiceSendDialog } from "./BulkInvoiceSendDialog";
import { InvoicePdfRenderSheets } from "./InvoicePdfRenderSheets";
import type { InvoiceSummary } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { getBulkInvoiceRecipients, syncAllInvoiceDeliveriesFromBrevo } from "@/store/invoices";
import type { InvoiceSendStatusFilter } from "@/store/invoices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INVOICE_EMAIL_FILTER_OPTIONS,
  type InvoiceEmailStatusFilter,
} from "@/utils/invoiceEmailStatus";
import {
  buildRenderJobsForRecipients,
  downloadInvoicePdfsAsZip,
  MAX_BULK_INVOICE_DOWNLOAD,
  nextFrame,
  resolveInvoiceListRange,
  type InvoicePdfRenderJob,
} from "@/utils/bulkInvoicePdf";

interface InvoicesTableProps {
  columns: ColumnDef<InvoiceSummary>[];
}

const InvoicesTable = ({
  columns,
}: InvoicesTableProps) => {
  const { toast } = useToast();
  const sheetRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [archived, setArchived] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [downloadingPdfs, setDownloadingPdfs] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ completed: number; total: number } | null>(null);
  const [renderJobs, setRenderJobs] = useState<InvoicePdfRenderJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sendStatus, setSendStatus] = useState<InvoiceSendStatusFilter>("all");
  const [syncingBrevo, setSyncingBrevo] = useState(false);
  const [brevoSyncProgress, setBrevoSyncProgress] = useState<string | null>(null);
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
    sendStatus,
  });

  const invoices = (data?.data ?? []) as InvoiceSummary[];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;
  /** API caps page size at 100 even if the UI requests more (e.g. 300). */
  const effectiveLimit = data?.limit ?? Math.min(limit, MAX_API_PAGE_SIZE);
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

  const handleBulkPdfDownload = async () => {
    if (selectedInvoiceIdList.length === 0) {
      toast({
        title: "No invoices selected",
        description: "Select at least one invoice to download.",
        variant: "destructive",
      });
      return;
    }

    if (selectedInvoiceIdList.length > MAX_BULK_INVOICE_DOWNLOAD) {
      toast({
        title: "Too many invoices selected",
        description: `Download up to ${MAX_BULK_INVOICE_DOWNLOAD} invoices at a time.`,
        variant: "destructive",
      });
      return;
    }

    setDownloadingPdfs(true);
    setDownloadProgress(null);
    setRenderJobs([]);

    try {
      const { recipients, truncated } = await getBulkInvoiceRecipients({
        invoiceIds: selectedInvoiceIdList,
        limit: MAX_BULK_INVOICE_DOWNLOAD,
      });

      if (recipients.length === 0) {
        throw new Error("No invoice details were found for the selected rows.");
      }

      if (truncated) {
        throw new Error(
          `Selection exceeds the ${MAX_BULK_INVOICE_DOWNLOAD}-invoice download limit. Select fewer invoices.`
        );
      }

      const { jobs, warnings } = await buildRenderJobsForRecipients(recipients);
      if (jobs.length === 0) {
        throw new Error("No invoice PDFs could be prepared for the selected invoices.");
      }

      setRenderJobs(jobs);
      await nextFrame();

      const { start, end } = await resolveInvoiceListRange(selectedInvoiceIdList, {
        archived,
        search: appliedSearch,
        sendStatus,
      });

      await downloadInvoicePdfsAsZip(jobs, sheetRefs.current, (completed, total) => {
        setDownloadProgress({ completed, total });
      }, { rangeStart: start, rangeEnd: end });

      toast({
        title: "Download ready",
        description:
          warnings.length > 0
            ? `${jobs.length} invoice PDF${jobs.length === 1 ? "" : "s"} saved. ${warnings.length} could not be loaded.`
            : `${jobs.length} invoice PDF${jobs.length === 1 ? "" : "s"} saved to zip.`,
        variant: warnings.length > 0 ? "destructive" : undefined,
      });
    } catch (error) {
      toast({
        title: "Bulk download failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingPdfs(false);
      setDownloadProgress(null);
      setRenderJobs([]);
    }
  };

  const switchArchived = () => {
    setArchived((a) => !a);
    setOffset(0);
    setSelectedInvoiceIds(new Set());
  };

  const handleSendStatusChange = (value: InvoiceSendStatusFilter) => {
    setSendStatus(value);
    setOffset(0);
    setSelectedInvoiceIds(new Set());
  };

  const handleSyncWithBrevo = async () => {
    setSyncingBrevo(true);
    setBrevoSyncProgress(null);
    try {
      const result = await syncAllInvoiceDeliveriesFromBrevo({
        limit: 100,
        onlyStale: false,
        onProgress: (data) => {
          const processed = data.offset + data.attempted;
          setBrevoSyncProgress(`${processed}/${data.totalEligible}`);
        },
      });
      await refetch();
      toast({
        title: "Brevo sync complete",
        description: `${result.totals.synced} synced${result.totals.failed > 0 ? `, ${result.totals.failed} failed` : ""} across ${result.totals.batches} batch${result.totals.batches === 1 ? "" : "es"}.`,
        variant: result.totals.failed > 0 ? "destructive" : undefined,
      });
    } catch (error) {
      toast({
        title: "Brevo sync failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncingBrevo(false);
      setBrevoSyncProgress(null);
    }
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
              placeholder="Search by property/account number or #client number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitSearch();
                }
              }}
              className="pr-9 w-full"
              aria-label="Search invoices by property/account number or client number (e.g. #4324)"
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
          <Select
            value={sendStatus}
            onValueChange={(value) => handleSendStatusChange(value as InvoiceSendStatusFilter)}
          >
            <SelectTrigger className="w-[11rem] shrink-0" aria-label="Filter by email status">
              <SelectValue placeholder="Email status" />
            </SelectTrigger>
            <SelectContent>
              {INVOICE_EMAIL_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          disabled={syncingBrevo}
          onClick={() => void handleSyncWithBrevo()}
        >
          {syncingBrevo ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <RefreshCw />
          )}
          {syncingBrevo && brevoSyncProgress
            ? `Syncing ${brevoSyncProgress}…`
            : "Sync with Brevo"}
        </Button>
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
        <Button
          variant="blue"
          disabled={downloadingPdfs || selectedInvoiceIdList.length === 0}
          onClick={() => void handleBulkPdfDownload()}
        >
          {downloadingPdfs ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <FileArchive />
          )}
          {downloadingPdfs && downloadProgress
            ? `Preparing ${downloadProgress.completed}/${downloadProgress.total}...`
            : selectedInvoiceIdList.length > 0
              ? `Bulk Download Selected (${selectedInvoiceIdList.length})`
              : "Bulk Download Selected"}
        </Button>
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
          window.setTimeout(() => {
            void refetch();
          }, 45000);
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
          limit: effectiveLimit,
          offset,
          hasMore,
          onPrev: () => setOffset((o) => Math.max(0, o - effectiveLimit)),
          onNext: () => setOffset((o) => o + effectiveLimit),
          onPageSizeChange: (size) => {
            if (size > MAX_API_PAGE_SIZE) {
              toast({
                title: "Page size capped at 100",
                description: `The API returns at most ${MAX_API_PAGE_SIZE} invoices per page. Use pagination or select across pages for bulk download.`,
              });
            }
            setLimit(Math.min(size, MAX_API_PAGE_SIZE));
            setOffset(0);
          },
        }}
      />
      <InvoicePdfRenderSheets jobs={renderJobs} sheetRefs={sheetRefs} />
    </div>
  );
};

export default InvoicesTable;
