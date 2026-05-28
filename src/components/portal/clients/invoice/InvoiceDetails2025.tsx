import React, { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatUSD } from "@/utils/formatCurrency";
import { Invoice, InvoiceData, InvoiceProperty } from "@/types/types";
import brandLogo from "@/assets/invoice-logo.png";

type InvoiceDetails2025Props = {
  invoice: InvoiceData;
  selectedYear: number;
};

function formatDate(value?: string): string {
  if (!value) return new Date().toLocaleDateString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toLocaleDateString();
  return date.toLocaleDateString();
}

function addDays(value: string, days: number): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString();
}

function toSafeFilenamePart(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/_+/g, "_");
}

function getYearInvoice(property: InvoiceProperty, year: number): Invoice | undefined {
  return property.invoice.find((inv) => inv.year === year);
}

const InvoiceDetails2025: React.FC<InvoiceDetails2025Props> = ({ invoice, selectedYear }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const firstMatch = useMemo(() => {
    const property = invoice.properties.find((p) => getYearInvoice(p, selectedYear));
    const yearInvoice = property ? getYearInvoice(property, selectedYear) : undefined;
    return { property, yearInvoice };
  }, [invoice.properties, selectedYear]);

  const contingencyPercent = Number(invoice.client.contingencyFee || "0");
  const taxSavings = firstMatch.yearInvoice?.taxableSavings ?? 0;
  const dueAmount = taxSavings * (contingencyPercent / 100);
  const invoiceDate = formatDate(firstMatch.yearInvoice?.invoiceDate);
  const dueDate = addDays(invoiceDate, 28);
  const cadOwnerNameRaw =
    firstMatch.property?.propertyDetails.nameOnCad ||
    firstMatch.property?.propertyDetails.contactOwner ||
    invoice.client.clientName ||
    "CAD_OWNER_NAME";
  const printFileName = `LSPTax_${toSafeFilenamePart(cadOwnerNameRaw)}_INVOICE_${selectedYear}`;

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: printFileName,
    pageStyle: `
      @page {
        size: letter;
        margin: 8mm;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        #invoice-2025-sheet {
          box-shadow: none !important;
          width: 100% !important;
          min-height: 255mm !important;
          margin: 0 auto !important;
          border: 1px solid #111 !important;
          border-radius: 0 !important;
          padding: 18px !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          font-family: "Nunito", sans-serif !important;
        }
      }
    `,
  });

  return (
    <div className="bg-gray-100 py-4">
      <div className="mx-auto max-w-[980px] px-3">
        <div className="mb-3 flex items-center justify-end">
          <Button variant="blue" className="bg-brand-blue text-white" onClick={() => reactToPrintFn()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>

        <div
          id="invoice-2025-sheet"
          ref={contentRef}
          className="mx-auto w-full max-w-[950px] min-h-[255mm] bg-white shadow p-5 text-[12px] leading-[1.2] text-black font-sans"
        >
          <div className="flex items-start gap-2 pb-2">
            <img src={brandLogo} alt="LSP Tax logo" className="h-[76px] w-[76px] object-contain" />
            <div className="pt-1 text-[13px] leading-[1.25] font-semibold">
              <p className="text-[17px] font-black tracking-wide leading-[1.1]">LONE STAR PROPERTY TAX</p>
              <p>16107 KENSINGTON DRIVE, STE. 194</p>
              <p>SUGARLAND, TX 77479</p>
              <p>info@lsptax.com</p>
              <p>713-505-6806</p>
            </div>
          </div>

          <div className="my-3 border border-black p-2">
            <div className="grid grid-cols-[1fr_360px] gap-3 items-start text-[13px] leading-[1.25] font-medium">
              <div>
                <p>{invoice.client.clientName}</p>
                <p>{invoice.client.mailingAddress}</p>
                <p>{invoice.client.mailingAddressCityTxZip}</p>
              </div>
              <div className="grid grid-cols-[150px_1fr] gap-y-1">
                <p>Invoice Date:</p>
                <p>{invoiceDate}</p>
                <p>Invoice Number:</p>
                <p>{firstMatch.yearInvoice?.id ?? "--"}</p>
              </div>
            </div>
          </div>

          <div className="my-3 text-center text-[16px] font-bold underline tracking-wide">
            FOR PROFESSIONAL SERVICES
          </div>

          <div className="border border-black p-3">
            <div className="grid grid-cols-2 text-[13px] leading-[1.25] font-medium">
              <div className="min-h-[62px]">
                <p className="font-semibold">Property Tax Representation For:</p>
                <p>{firstMatch.property?.propertyDetails.nameOnCad || "--"}</p>
                <p>{firstMatch.property?.propertyDetails.propertyAddress || "--"}</p>
                <p>{firstMatch.property?.propertyDetails.mailingAddressCityTxZip || "--"}</p>
              </div>
              <div className="min-h-[62px] grid grid-cols-[150px_1fr]">
                <p>Account Number:</p>
                <p>{firstMatch.property?.propertyDetails.accountNumber || "--"}</p>
                <p>Service:</p>
                <p>{selectedYear} Protest</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 text-[13px] leading-[1.25] font-medium">
              <div className="min-h-[88px]">
                <p>Begining Appraised Value: {formatUSD(firstMatch.yearInvoice?.beginningAppraised)}</p>
                <p>Ending Appraised Value: {formatUSD(firstMatch.yearInvoice?.endingAppraised)}</p>
                <p>Rduction: {formatUSD(firstMatch.yearInvoice?.appraisedReduction)}</p>
                <p>Overall Tax Rate: {firstMatch.yearInvoice?.taxRate ?? 0}%</p>
              </div>
              <div className="min-h-[88px]">
                <p>Begining Market Value: {formatUSD(firstMatch.yearInvoice?.beginningMarket)}</p>
                <p>Ending Market Value: {formatUSD(firstMatch.yearInvoice?.endingMarket)}</p>
                <p>Rduction: {formatUSD(firstMatch.yearInvoice?.marketReduction)}</p>
              </div>
            </div>

            <div className="mt-4 w-[300px] border border-black p-2 text-[13px] leading-[1.2] font-semibold">
              <div className="grid grid-cols-[1fr_1fr]">
                <p>Client Tax Savings:</p>
                <p>{formatUSD(taxSavings)}</p>
                <p>Contingency Fee:</p>
                <p>{contingencyPercent}%</p>
                <p>Due:</p>
                <p>{formatUSD(dueAmount)}</p>
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-black pt-1 text-center text-[15px] font-bold leading-none">
            Cut Here ✂
          </div>

          <div className="grid grid-cols-[1fr_340px] gap-4 min-h-[110px] text-[13px] leading-[1.25] font-medium">
            <div className="pl-1 pt-1">
              <p>{invoice.client.clientName}</p>
              <p>{invoice.client.mailingAddress}</p>
              <p>{invoice.client.mailingAddressCityTxZip}</p>
            </div>
            <div className="border border-black p-2">
              <div className="grid grid-cols-[140px_1fr] font-semibold">
                <p>Invoice Number:</p>
                <p>{firstMatch.yearInvoice?.id ?? "--"}</p>
                <p>Total Fee Due:</p>
                <p>{formatUSD(dueAmount)}</p>
                <p>Invoice Date:</p>
                <p>{invoiceDate}</p>
                <p>Due Date:</p>
                <p>{dueDate}</p>
              </div>
              <div className="mt-5 grid grid-cols-[140px_1fr] font-semibold">
                <p>Amount Enclosed:</p>
                <p className="border-b border-black" />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_1fr] text-[13px] leading-[1.25] font-semibold">
            <div>
              <p>Please remit payment to adress below:</p>
              <p className="mt-1">LONE STAR PROPERTY TAX</p>
              <p>16107 KENSINGTON DRIVE, STE. 194</p>
              <p>SUGARLAND, TX 77479</p>
            </div>
            <div>
              <p>OR&nbsp;&nbsp; ZELLE: (Include Invoice number)</p>
              <p>713-505-6806 (Lone Star Property Tax)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails2025;
