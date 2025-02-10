import { Invoice } from "@/types/types";
// import formatDate from "@/utils/formatDate";
import React from "react";

// Define the type for table row data
type TableRow = {
  year: number;
  "Protested Date": string;
  "BPP Rendered": string;
  "BPP Invoice": string;
  "BPP Invoice Paid": string;
  "Notice Market Value": string;
  "Assessed Prelim": string | undefined;
  "Final Prelim": string;
  "Final Market Value": string;
  "Market Value Reduction": string;
  "Hearing Date": string | undefined;
  "Invoice Date": string | undefined;
  "Under Litigation": boolean;
  "Under Arbitration": boolean;
  "Contingency Fee": string|undefined;
  "Invoice Amount": string|undefined;
  "Paid Date": string | undefined;
  "Payment Notes": string | undefined;
};

const YearTable: React.FC<{ invoices: Invoice[] }> = ({ invoices }) => {
  // Extract data for the table: creating rows and columns
  console.log({ invoices });
  const years = [2021, 2022, 2023, 2024, 2025];
  const rowData: TableRow[] = years.map((year) => {
    const yearData = invoices.find((invoice) => invoice.year === year);

    return {
      year,
      "Protested Date": "-",
      "BPP Rendered": "",
      "BPP Invoice": yearData?.BPPInvoice || "-",
      "BPP Invoice Paid": yearData?.BPPInvoicePaid || "-",
      "Notice Market Value": yearData?.NoticeMarketValue || "-",
      "Assessed Prelim": yearData?.NoticeAppraisedValue,
      "Final Prelim": yearData?.FinalAppraisedValue || "-",
      "Final Market Value": yearData?.FinalMarketValue || "-",
      "Market Value Reduction": yearData?.MarketValueReduction || "-",
      "Hearing Date": yearData?.hearingDate,
      "Invoice Date": yearData?.invoiceDate,
      "Under Litigation": yearData?.underLitigation || false,
      "Under Arbitration": yearData?.underArbitration || false,
      "Contingency Fee": yearData ? yearData.ArbitrationContingencyFee : "N/A",
      "Invoice Amount": yearData ? yearData.TotalDue : "N/A",
      "Paid Date": yearData?.paidDate,
      "Payment Notes": yearData?.paymentNotes,
    };
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Yearly Invoices Summary
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full text-left border-collapse bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <th className="px-6 py-3 text-sm font-medium uppercase"></th>
              {years.map((year) => (
                <th
                  key={year}
                  className="px-6 py-3 text-sm font-medium uppercase"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(rowData[0]).map((key, idx) => {
              if (key === "year") return null;
              return (
                <tr
                  key={idx}
                  className={`hover:bg-gray-100 ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">
                    {key}
                  </td>
                  {rowData.map((data) => (
                    <td
                      key={data.year}
                      className="px-6 py-3 text-sm text-gray-700"
                    >
                      {data[key as keyof TableRow]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearTable;
