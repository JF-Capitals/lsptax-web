import React from "react";
import { InvoiceData } from "@/types/types";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const InvoiceDetails: React.FC<{
  invoice?: InvoiceData;
  selectedYear: number;
}> = ({ invoice, selectedYear }) => {
  const getYearlyInvoiceData = (property: any) => {
    return property.invoice.find((inv: any) => inv.year === selectedYear);
  };

  const calculateFees = () => {
    if (!invoice) return 0;
    return invoice.properties.reduce((total, property) => {
      const yearlyInvoice = getYearlyInvoiceData(property);
      const fee = yearlyInvoice?.invoiceAmount;
      return total + (isNaN(fee) ? 0 : fee);
    }, 0);
  };
  const totalFees = calculateFees();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    @media print {
      body { zoom: 1; }
      #pdf-content {
        width: 100%;
        max-width: 420mm;
        height: auto !important;
        overflow: visible !important;
      }
      table {
        page-break-inside: auto;
        width: 100%;
        max-width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      th, td {
        font-size: 8px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
      }
      th:nth-last-child(-n+4),
      td:nth-last-child(-n+4) {
        min-width: 50px;
        max-width: 70px;
      }
          @media print {
      /* Previous styles remain the same */
      
      th, td {
        font-size: 8px;
        padding: 1px !important;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
      }
    }
    }
  `,
  });

  return (
    <>
      <div className="text-center">
        <Button
          variant={"blue"}
          className="bg-[#0093FF] rounded-md p-2 px-6 ml-4 text-white"
          onClick={() => reactToPrintFn()}
        >
          <Printer />
          Print
        </Button>
      </div>

      <div
        className="flex justify-center items-center min-h-screen bg-gray-100"
        style={{ overflow: "hidden" }}
      >
        <div
          ref={contentRef}
          id="pdf-content"
          className="bg-white min-w-screen h-[210mm] overflow-auto shadow-lg sm:p-6 md:p-8"
        >
          <div className="flex justify-between items-start mb-4 border-4 border-black">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">LONE STAR PROPERTY TAX</h2>
                <p className="text-sm">16107 KENSINGTON DRIVE, STE. 194</p>
                <p className="text-sm">SUGARLAND, TX 77479</p>
                <p className="text-sm">info@lsptax.com</p>
                <p className="text-sm">713-505-6806</p>
              </div>
            </div>
            <div>
              <div>
                <p>{invoice?.client?.CLIENTNAME}</p>
                <p>{invoice?.client?.MAILINGADDRESS}</p>
                <p>{invoice?.client?.MAILINGADDRESSCITYTXZIP}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse border-2 border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Type of Account
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Property Address
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    County
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Account Number
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Invoice Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Notice Market value
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Final Market value
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Market Value Reduction
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Notice Appraised Value
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Final Appraised Value
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Appraised Value Reduction
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Overall Tax Rate
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Tax Savings
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Contingency (%)
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Contingency Fee Due:
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice?.properties.map((property) => {
                  const yearlyInvoice = getYearlyInvoiceData(property);
                  return (
                    <tr key={property.propertyDetails.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {invoice.client.TypeOfAcct}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {property.propertyDetails.CADMailingADDRESS}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {property.propertyDetails.CADCOUNTY}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {property.propertyDetails.AccountNumber}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {selectedYear} Protest
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.noticeMarketValue?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.finalMarketValue?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.marketReduction?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.noticeAppraisedValue?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.finalAppraisedValue?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.appraisedReduction?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.taxRate?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.taxableSavings?.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {yearlyInvoice?.contingency || 25}%
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ${yearlyInvoice?.contingencyFee?.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={14}
                    className="border border-gray-300 px-4 py-2 text-right font-bold"
                  >
                    Total
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    ${totalFees.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetails;
