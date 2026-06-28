import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, RefreshCw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  bulkSendInvoices,
  getBulkInvoiceRecipients,
  getInvoice,
  type BulkInvoiceRecipient,
  type BulkInvoiceSendFilters,
} from "@/store/invoices";
import { Invoice, InvoiceData, InvoiceProperty } from "@/types/types";
import { normalizeInvoiceClient } from "@/utils/clientContact";
import { elementsToPdfAttachments } from "@/utils/elementToPdfBase64";
import { formatUSD } from "@/utils/formatCurrency";
import InvoiceSheet2025, {
  addInvoiceDays,
  formatInvoiceDate,
  toSafeFilenamePart,
} from "../clients/invoice/InvoiceSheet2025";

type BulkInvoiceSendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: BulkInvoiceSendFilters;
  onSent?: () => void;
};

type RenderJob = {
  key: string;
  clientId: number;
  filename: string;
  client: InvoiceData["client"];
  property: InvoiceProperty;
  yearInvoice: Invoice;
  selectedYear: number;
  invoiceDate: string;
  dueDate: string;
};

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

const getSource = (raw: unknown) => ((raw as { data?: unknown })?.data ?? raw);

const normalizeBulkInvoiceData = (raw: unknown): InvoiceData | undefined => {
  const source = getSource(raw);

  if (!source || typeof source !== "object") return undefined;

  const sourceArray = Array.isArray(source) ? source : [source];
  const first = sourceArray[0] as
    | {
        client?: unknown;
        clientDetails?: unknown;
        propertyDetails?: unknown;
        invoices?: unknown;
        properties?: unknown;
      }
    | undefined;

  if ((first?.client || first?.clientDetails) && Array.isArray(first.properties)) {
    return {
      client: normalizeInvoiceClient(first.client ?? first.clientDetails),
      properties: first.properties as InvoiceData["properties"],
    };
  }

  if ((first?.client || first?.clientDetails) && first.propertyDetails && Array.isArray(first.invoices)) {
    const client = normalizeInvoiceClient(
      first.client ?? first.clientDetails,
      first.propertyDetails as Record<string, unknown>
    );
    const properties = sourceArray
      .map((item) => item as { propertyDetails?: unknown; invoices?: unknown })
      .filter((item) => item.propertyDetails && Array.isArray(item.invoices))
      .map((item) => ({
        propertyDetails: item.propertyDetails as InvoiceProperty["propertyDetails"],
        invoice: item.invoices as Invoice[],
      }));

    return { client, properties };
  }

  const maybeSingle = source as {
    client?: unknown;
    clientDetails?: unknown;
    propertyDetails?: unknown;
    invoices?: unknown;
  };
  if ((maybeSingle.client || maybeSingle.clientDetails) && maybeSingle.propertyDetails && Array.isArray(maybeSingle.invoices)) {
    return {
      client: normalizeInvoiceClient(
        maybeSingle.client ?? maybeSingle.clientDetails,
        maybeSingle.propertyDetails as Record<string, unknown>
      ),
      properties: [
        {
          propertyDetails: maybeSingle.propertyDetails as InvoiceProperty["propertyDetails"],
          invoice: maybeSingle.invoices as Invoice[],
        },
      ],
    };
  }

  return undefined;
};

const buildRenderJobsForRecipient = async (
  recipient: BulkInvoiceRecipient
): Promise<RenderJob[]> => {
  const raw = await getInvoice({ clientId: String(recipient.clientId) });
  const invoiceData = normalizeBulkInvoiceData(raw);
  if (!invoiceData) {
    throw new Error(`Could not load invoice details for ${recipient.clientName}.`);
  }

  const propertyIds = new Set(recipient.propertyIds.map(Number));
  const invoiceIds = new Set(recipient.invoiceIds.map(Number));
  const years = new Set(recipient.years.map(Number));
  const clientName = toSafeFilenamePart(
    recipient.clientNumber || invoiceData.client.clientNumber || recipient.clientName
  );

  return invoiceData.properties.flatMap((property) => {
    const propertyId = Number(property.propertyDetails.id);
    if (propertyIds.size > 0 && !propertyIds.has(propertyId)) return [];

    return property.invoice
      .filter((invoice) => invoiceIds.size === 0 || invoiceIds.has(Number(invoice.id)))
      .filter((invoice) => years.size === 0 || years.has(Number(invoice.year)))
      .map((yearInvoice) => {
        const selectedYear = Number(yearInvoice.year);
        const invoiceDate = formatInvoiceDate(yearInvoice.invoiceDate);
        const account = toSafeFilenamePart(
          property.propertyDetails.accountNumber || String(propertyId)
        );

        return {
          key: `${recipient.clientId}-${propertyId}-${selectedYear}`,
          clientId: recipient.clientId,
          filename: `invoice-${clientName}-${account}-${selectedYear}.pdf`,
          client: invoiceData.client,
          property,
          yearInvoice,
          selectedYear,
          invoiceDate,
          dueDate: addInvoiceDays(invoiceDate, 28),
        };
      });
  });
};

export function BulkInvoiceSendDialog({
  open,
  onOpenChange,
  filters,
  onSent,
}: BulkInvoiceSendDialogProps) {
  const { toast } = useToast();
  const sheetRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [recipients, setRecipients] = useState<BulkInvoiceRecipient[]>([]);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set());
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSms, setSendSms] = useState(true);
  const [truncated, setTruncated] = useState(false);

  const selectedRecipients = useMemo(
    () => recipients.filter((recipient) => selectedClientIds.has(recipient.clientId) && recipient.canSend),
    [recipients, selectedClientIds]
  );

  const loadRecipients = async () => {
    setLoadingRecipients(true);
    setRenderJobs([]);
    try {
      const result = await getBulkInvoiceRecipients({ ...filters, hasEmail: true, limit: filters.limit ?? 500 });
      setRecipients(result.recipients);
      setSelectedClientIds(
        new Set(result.recipients.filter((recipient) => recipient.canSend).map((recipient) => recipient.clientId))
      );
      setTruncated(result.truncated);
    } catch (error) {
      toast({
        title: "Could not preview recipients",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingRecipients(false);
    }
  };

  useEffect(() => {
    if (open) {
      void loadRecipients();
    } else {
      setRenderJobs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(filters)]);

  const toggleRecipient = (clientId: number, checked: boolean) => {
    setSelectedClientIds((current) => {
      const next = new Set(current);
      if (checked) next.add(clientId);
      else next.delete(clientId);
      return next;
    });
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Select at least one eligible client before sending invoices.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const jobs = (await Promise.all(selectedRecipients.map(buildRenderJobsForRecipient))).flat();
      if (jobs.length === 0) {
        throw new Error("No matching invoice PDFs could be prepared for the selected recipients.");
      }

      setRenderJobs(jobs);
      await nextFrame();

      const attachmentsByClient = [];
      for (const recipient of selectedRecipients) {
        const clientJobs = jobs.filter((job) => job.clientId === recipient.clientId);
        const captureElements = clientJobs.map((job) => {
          const element = sheetRefs.current.get(job.key);
          if (!element) {
            throw new Error(`Could not prepare invoice PDF for ${recipient.clientName}.`);
          }
          return { element, filename: job.filename };
        });

        attachmentsByClient.push({
          clientId: recipient.clientId,
          year: recipient.years.length === 1 ? recipient.years[0] : undefined,
          attachments: await elementsToPdfAttachments(captureElements),
        });
      }

      const result = await bulkSendInvoices({
        filters: {
          ...filters,
          clientIds: selectedRecipients.map((recipient) => recipient.clientId),
          hasEmail: true,
        },
        attachmentsByClient,
        sendSms,
        limit: selectedRecipients.length,
      });

      const { sent, failed, skipped } = result.data.summary;
      toast({
        title: "Bulk invoice send complete",
        description: `${sent} sent, ${failed} failed, ${skipped} skipped.`,
        variant: failed > 0 ? "destructive" : undefined,
      });

      if (failed > 0 || skipped > 0) {
        const firstIssue = result.data.results.find((row) => row.error);
        if (firstIssue?.error) {
          toast({
            title: "Some invoices were not sent",
            description: firstIssue.error,
            variant: "destructive",
          });
        }
      }

      onSent?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Bulk send failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setRenderJobs([]);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen) => !isSending && onOpenChange(nextOpen)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Bulk send invoices</DialogTitle>
            <DialogDescription>
              Preview eligible clients from the current invoice filters, then email generated PDFs in one batch.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
              <div>
                <p className="font-medium">{selectedRecipients.length} selected</p>
                <p className="text-sm text-muted-foreground">
                  {recipients.length} eligible recipient{recipients.length === 1 ? "" : "s"}
                  {truncated ? " shown, list truncated at API limit" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="bulk-send-sms"
                  checked={sendSms}
                  onCheckedChange={(checked) => setSendSms(checked === true)}
                />
                <label htmlFor="bulk-send-sms" className="cursor-pointer text-sm">
                  Send SMS notifications when phone numbers exist
                </label>
              </div>
            </div>

            <div className="max-h-[360px] overflow-auto rounded-lg border">
              {loadingRecipients ? (
                <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Loading recipients...
                </div>
              ) : recipients.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No clients with invoice email addresses matched these filters.
                </div>
              ) : (
                recipients.map((recipient) => (
                  <div
                    key={recipient.clientId}
                    className="flex items-start gap-3 border-b p-3 last:border-b-0"
                  >
                    <Checkbox
                      checked={selectedClientIds.has(recipient.clientId)}
                      disabled={!recipient.canSend || isSending}
                      onCheckedChange={(checked) => toggleRecipient(recipient.clientId, checked === true)}
                      aria-label={`Select ${recipient.clientName}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{recipient.clientName}</p>
                        {recipient.clientNumber && (
                          <Badge variant="outline">{recipient.clientNumber}</Badge>
                        )}
                        {!recipient.canSend && (
                          <Badge variant="destructive">{recipient.skipReason || "Cannot send"}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {recipient.recipientEmail} · {recipient.invoiceCount} invoice
                        {recipient.invoiceCount === 1 ? "" : "s"} · {formatUSD(recipient.totalInvoiceAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Years: {recipient.years.join(", ") || "Any"} · Properties:{" "}
                        {(recipient.propertyNumbers?.length ? recipient.propertyNumbers : recipient.propertyIds).join(", ")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={isSending} onClick={() => void loadRecipients()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" disabled={isSending} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={isSending || loadingRecipients || selectedRecipients.length === 0} onClick={handleSend}>
              {isSending ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isSending ? "Sending..." : "Send selected"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed left-[-10000px] top-0 w-[950px] pointer-events-none" aria-hidden>
        {renderJobs.map((job) => (
          <InvoiceSheet2025
            key={job.key}
            ref={(node) => {
              if (node) sheetRefs.current.set(job.key, node);
              else sheetRefs.current.delete(job.key);
            }}
            client={job.client}
            property={job.property}
            yearInvoice={job.yearInvoice}
            selectedYear={job.selectedYear}
            invoiceDate={job.invoiceDate}
            dueDate={job.dueDate}
          />
        ))}
      </div>
    </>
  );
}
