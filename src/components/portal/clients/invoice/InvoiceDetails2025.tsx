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

  const reactToPrintFn = useReactToPrint({
    contentRef,
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
          min-height: auto !important;
          margin: 0 auto !important;
          border: 1px solid #111 !important;
          border-radius: 0 !important;
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
          className="mx-auto w-full max-w-[820px] bg-white shadow p-6 text-[13px] leading-[1.3] text-black font-['Times_New_Roman']"
        >
          <div className="flex items-start justify-between border-b border-black pb-3">
            <div className="flex items-start gap-3">
              <img src={brandLogo} alt="LSP Tax logo" className="h-[98px] w-[98px] object-contain" />
              <div className="pt-1">
                <p className="text-[22px] font-bold tracking-wide leading-6">LONE STAR PROPERTY TAX</p>
                <p>16107 KENSINGTON DRIVE, STE. 194</p>
                <p>SUGARLAND, TX 77479</p>
                <p>713-505-6806</p>
                <p>info@lsptax.com</p>
              </div>
            </div>
            <div className="text-right pt-2 min-w-[250px]">
              <p className="font-semibold tracking-wide text-[14px]">FOR PROFESSIONAL SERVICES</p>
              <p>
                Invoice Number: <span className="font-semibold">{firstMatch.yearInvoice?.id ?? "--"}</span>
              </p>
              <p>
                Invoice Date: <span className="font-semibold">{invoiceDate}</span>
              </p>
              <p>
                Due Date: <span className="font-semibold">{invoiceDate}</span>
              </p>
              <p>
                Total Fee Due: <span className="font-semibold">{formatUSD(dueAmount)}</span>
              </p>
            </div>
          </div>

          <div className="my-5 grid grid-cols-[1fr_300px] gap-6 items-start">
            <div>
              <p className="font-semibold uppercase">{invoice.client.clientName}</p>
              <p>{invoice.client.mailingAddress}</p>
              <p>{invoice.client.mailingAddressCityTxZip}</p>
            </div>
            <div className="border border-black p-3">
              <p className="font-semibold">Payment Options</p>
              <p className="mt-1">ZELLE: 713-505-6806 (Lone Star Property Tax)</p>
              <p>Include invoice number in memo.</p>
            </div>
          </div>

          <div className="border border-black">
            <div className="grid grid-cols-2">
              <div className="p-3 min-h-[82px]">
                <p className="font-semibold">Property Tax Representation For</p>
                <p>{firstMatch.property?.propertyDetails.mailingAddress || "--"}</p>
                <p>{firstMatch.property?.propertyDetails.mailingAddressCityTxZip || "--"}</p>
              </div>
              <div className="p-3 min-h-[82px]">
                <p>
                  Account Number:{" "}
                  <span className="font-semibold">
                    {firstMatch.property?.propertyDetails.accountNumber || "--"}
                  </span>
                </p>
                <p>
                  Service: <span className="font-semibold">{selectedYear} Protest</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="p-3 min-h-[86px]">
                <p>Beginning Appraised Value: {formatUSD(firstMatch.yearInvoice?.beginningAppraised)}</p>
                <p>Ending Appraised Value: {formatUSD(firstMatch.yearInvoice?.endingAppraised)}</p>
                <p>Reduction: {formatUSD(firstMatch.yearInvoice?.appraisedReduction)}</p>
              </div>
              <div className="p-3 min-h-[86px]">
                <p>Beginning Market Value: {formatUSD(firstMatch.yearInvoice?.beginningMarket)}</p>
                <p>Ending Market Value: {formatUSD(firstMatch.yearInvoice?.endingMarket)}</p>
                <p>Reduction: {formatUSD(firstMatch.yearInvoice?.marketReduction)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 border border-black p-3">
            <p>
              Overall Tax Rate: <span className="font-semibold">{firstMatch.yearInvoice?.taxRate ?? 0}%</span>
            </p>
            <p>
              Client Tax Savings: <span className="font-semibold">{formatUSD(taxSavings)}</span>
            </p>
            <p>
              Contingency Fee: <span className="font-semibold">{contingencyPercent}%</span>
            </p>
          </div>

          <div className="mt-4 text-right text-[20px] font-bold">Due: {formatUSD(dueAmount)}</div>

          <div className="my-5 border-t border-dashed border-black pt-2 text-[10px] tracking-[0.16em] uppercase">
            Cut Here
          </div>

          <div className="grid grid-cols-[1fr_300px] gap-6 border border-black p-3 min-h-[120px]">
            <div className="pt-1">
              <p className="font-semibold">Please remit payment to address below:</p>
              <p className="mt-2">LONE STAR PROPERTY TAX</p>
              <p>16107 KENSINGTON DRIVE, STE. 194</p>
              <p>SUGARLAND, TX 77479</p>
            </div>
            <div className="border border-black p-3">
              <p>
                Invoice Date: <span className="font-semibold">{invoiceDate}</span>
              </p>
              <p>
                Invoice Number: <span className="font-semibold">{firstMatch.yearInvoice?.id ?? "--"}</span>
              </p>
              <p className="mt-2">
                Amount Enclosed: <span className="font-semibold">{formatUSD(dueAmount)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails2025;
