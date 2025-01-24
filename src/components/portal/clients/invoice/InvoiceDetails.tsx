import React from "react";
import { InvoiceData } from "@/types/types";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const InvoiceDetails: React.FC<{ invoice?: InvoiceData }> = ({ invoice }) => {
  const calculateFees = () => {
    if (!invoice?.properties) return 0;

    return invoice.properties.reduce((total, property) => {
      const feeString = property.invoice.ContingencyFeeDue || "$0";
      const numericValue = parseFloat(feeString.replace(/[^0-9.]/g, "")); // Remove '$' and other characters
      console.log({ numericValue });
      return total + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  };
  const totalFees = calculateFees();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
    @page {
      size: A4 portrait;
      margin: 0;
    }
    @media print {
      body {
        zoom: 1;
      }
      #pdf-content {
        width: 100%;
        max-width: 297mm;
      }
        
      table {
        width: 100%;
        max-width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
      }
      th, td {
        font-size: 8px;
        padding: 2px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
      }
      th:nth-last-child(-n+4),
      td:nth-last-child(-n+4) {
        min-width: 50px;
        max-width: 70px;
      }
    }
  `
  });
  return (
    <>
      <div className="text-center ">
        <button
          className="bg-[#0093FF] rounded-md p-2 px-6 m-2 text-white"
          onClick={() => reactToPrintFn()}
        >
          Print Detailed Invoice
        </button>
      </div>

      <div
        className="flex justify-center items-center min-h-screen bg-gray-100"
        style={{
          overflow: "hidden",
        }}
      >

        {/* A4 Page Container */}
        <div ref={contentRef}
          id="pdf-content"
          className="bg-white min-w-screen h-[210mm] overflow-auto shadow-lg p-4 sm:p-6 md:p-8"
        >


          <div className="flex justify-between items-start mb-4 border-4 border-black">
            <div className="flex justify-between items-start  ">
              {/* <img className="w-20 mr-2  p-2" src={Logo}></img> */}
              <div>
                <h2 className="text-xl font-bold">LONE STAR PROPERTY TAX</h2>
                <p className="text-sm">16107 KENSINGTON DRIVE, STE. 194</p>
                <p className="text-sm">SUGARLAND, TX 77479</p>
                <p className="text-sm">info@lsptax.com</p>
                <p className="text-sm">713-505-6806</p>
              </div>
            </div>
            <div className="">
              <div>
                <p>{invoice?.client?.CLIENTNAME}</p>
                <p>{invoice?.client?.MAILINGADDRESS}</p>
                <p>{invoice?.client?.MAILINGADDRESSCITYTXZIP}</p>
              </div>
            </div>
          </div>

          {/* Additional content */}
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
                {invoice?.properties.map((property) => (
                  <tr key={property.propertyDetails.id}>
                    <td className="border border-gray-300 px-4 py-2">Real</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {property.propertyDetails.CADMailingADDRESS}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{property.propertyDetails.CADCOUNTY}</td>
                    <td className="border border-gray-300 px-4 py-2">{property.propertyDetails.AccountNumber}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      2025 Protest
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {property.invoice.NoticeMarketValue}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {property.invoice.FinalMarketValue}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{property.invoice.MarketValueReduction}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {property.invoice.NoticeAppraisedValue}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {property.invoice.FinalAppraisedValue}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{property.invoice.ValueAppraisedValueReduction}</td>
                    <td className="border border-gray-300 px-4 py-2">{property.invoice.ValueOverallTaxRate}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {property.invoice.ValueTaxSavings}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{property.invoice.Contingency}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {property.invoice.ContingencyFeeDue}
                    </td>
                  </tr>
                ))}
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
                    ${totalFees}
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
