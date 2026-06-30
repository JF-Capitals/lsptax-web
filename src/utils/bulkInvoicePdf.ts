import JSZip from "jszip";

import {
  getInvoice,
  getInvoiceByPropertyId,
  type BulkInvoiceRecipient,
} from "@/store/invoices";
import { getFormattedDate } from "@/store/common";
import { Invoice, InvoiceData, InvoiceProperty } from "@/types/types";
import { elementToPdfBase64 } from "@/utils/elementToPdfBase64";
import { normalizeInvoiceData } from "@/utils/invoiceDataNormalization";
import {
  addInvoiceDays,
  formatInvoiceDate,
  toSafeFilenamePart,
} from "@/components/portal/clients/invoice/InvoiceSheet2025";

export const MAX_BULK_INVOICE_DOWNLOAD = 50;

export type InvoicePdfRenderJob = {
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

export const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

const buildJobsFromInvoiceData = (
  invoiceData: InvoiceData,
  recipient: BulkInvoiceRecipient,
  options?: { restrictPropertyId?: number }
): InvoicePdfRenderJob[] => {
  const propertyIds = new Set(recipient.propertyIds.map(Number));
  const invoiceIds = new Set(recipient.invoiceIds.map(Number));
  const years = new Set(recipient.years.map(Number));
  const clientName = toSafeFilenamePart(
    recipient.clientNumber || invoiceData.client.clientNumber || recipient.clientName
  );

  return invoiceData.properties.flatMap((property) => {
    const propertyId = Number(property.propertyDetails.id);
    if (options?.restrictPropertyId && propertyId !== options.restrictPropertyId) return [];
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

export const buildRenderJobsForRecipient = async (
  recipient: BulkInvoiceRecipient
): Promise<InvoicePdfRenderJob[]> => {
  const propertyIds = [...new Set(recipient.propertyIds.map(Number).filter(Number.isFinite))];
  const jobs: InvoicePdfRenderJob[] = [];

  for (const propertyId of propertyIds) {
    const raw = await getInvoiceByPropertyId({ propertyId: String(propertyId) });
    const { invoiceData } = normalizeInvoiceData(raw);
    if (!invoiceData) continue;
    jobs.push(
      ...buildJobsFromInvoiceData(invoiceData, recipient, { restrictPropertyId: propertyId })
    );
  }

  if (jobs.length === 0) {
    const raw = await getInvoice({ clientId: String(recipient.clientId) });
    const { invoiceData } = normalizeInvoiceData(raw);
    if (!invoiceData) {
      throw new Error(`Could not load invoice details for ${recipient.clientName}.`);
    }
    jobs.push(...buildJobsFromInvoiceData(invoiceData, recipient));
  }

  const uniqueJobs = Array.from(new Map(jobs.map((job) => [job.key, job])).values());

  if (uniqueJobs.length === 0) {
    throw new Error(`No matching invoice PDFs for ${recipient.clientName}.`);
  }

  return uniqueJobs;
};

export const buildRenderJobsForRecipients = async (
  recipients: BulkInvoiceRecipient[]
): Promise<{ jobs: InvoicePdfRenderJob[]; warnings: string[] }> => {
  const results = await Promise.allSettled(recipients.map(buildRenderJobsForRecipient));
  const jobs: InvoicePdfRenderJob[] = [];
  const warnings: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      jobs.push(...result.value);
    } else {
      warnings.push(
        result.reason instanceof Error ? result.reason.message : "Failed to prepare some invoices."
      );
    }
  }

  const uniqueJobs = Array.from(new Map(jobs.map((job) => [job.key, job])).values());

  if (uniqueJobs.length === 0 && warnings.length > 0) {
    throw new Error(warnings[0]);
  }

  return { jobs: uniqueJobs, warnings };
};

export async function downloadInvoicePdfsAsZip(
  jobs: InvoicePdfRenderJob[],
  sheetRefs: Map<string, HTMLDivElement>,
  onProgress?: (completed: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();

  for (let index = 0; index < jobs.length; index += 1) {
    const job = jobs[index];
    const element = sheetRefs.get(job.key);
    if (!element) {
      throw new Error(`Could not prepare PDF for ${job.filename}.`);
    }

    const contentBase64 = await elementToPdfBase64(element);
    zip.file(job.filename, contentBase64, { base64: true });
    onProgress?.(index + 1, jobs.length);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `invoices_${getFormattedDate()}.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
