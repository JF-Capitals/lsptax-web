import { Invoice } from "@/types/types";
// import formatDate from "@/utils/formatDate";
import React from "react";

// Define the type for table row data
type TableRow = {
  year: number;
  "Protested Date": string;
  "BPP Rendered": string;
  "BPP Invoice": string;
  "BPP Paid": string;
  "Notice Land Value": string;
  "Notice Improvement Value": string;
  "Notice Market Value": string;
  "Notice Appraised Value": string;
  "Final Land Value": string;
  "Final Improvement Value": string;
  "Final Market Value": string;
  "Final Appraised Value": string;
  "Market Reduction": string;
  "Appraised Reduction": string;
  "Hearing Date"?: string;
  "Invoice Date"?: string;
  "Under Litigation": boolean;
  "Under Arbitration": boolean;
  "Tax Rate": string;
  "Taxable Savings": string;
  "Contingency Fee"?: string;
  "Invoice Amount"?: string;
  "Paid Date"?: string;
  "Payment Notes"?: string;
  "Beginning Market": string;
  "Ending Market": string;
  "Beginning Appraised": string;
  "Ending Appraised": string;
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
      "BPP Invoice": yearData?.bppInvoice || "-",
      "BPP Paid": yearData?.bppPaid || "-",
      "Notice Land Value": yearData?.noticeLandValue || "-",
      "Notice Improvement Value": yearData?.noticeImprovementValue || "-",
      "Notice Market Value": yearData?.noticeMarketValue || "-",
      "Notice Appraised Value": yearData?.noticeAppraisedValue || "-",
      "Final Land Value": yearData?.finalLandValue || "-",
      "Final Improvement Value": yearData?.finalImprovementValue || "-",
      "Final Market Value": yearData?.finalMarketValue || "-",
      "Final Appraised Value": yearData?.finalAppraisedValue || "-",
      "Market Reduction": yearData?.marketReduction || "-",
      "Appraised Reduction": yearData?.appraisedReduction || "-",
      "Hearing Date": yearData?.hearingDate || "-",
      "Invoice Date": yearData?.invoiceDate || "-",
      "Under Litigation": yearData?.underLitigation || false,
      "Under Arbitration": yearData?.underArbitration || false,
      "Tax Rate": yearData?.taxRate || "-",
      "Taxable Savings": yearData?.taxableSavings || "-",
      "Contingency Fee": yearData?.contingencyFee || "N/A",
      "Invoice Amount": yearData?.invoiceAmount || "N/A", 
      "Paid Date": yearData?.paidDate || "-",
      "Payment Notes": yearData?.paymentNotes || "-",
      "Beginning Market": yearData?.beginningMarket || "-",
      "Ending Market": yearData?.endingMarket || "-",
      "Beginning Appraised": yearData?.beginningAppraised || "-",
      "Ending Appraised": yearData?.endingAppraised || "-",
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
            {Object.keys(rowData[0])
              .filter((key) => {
                const isConditionalField = [
                  "Beginning Market",
                  "Ending Market",
                  "Beginning Appraised",
                  "Ending Appraised",
                ].includes(key);

                if (!isConditionalField) return true; // Show all normal fields

                return rowData.some(
                  (data) =>
                    data["Under Litigation"] || data["Under Arbitration"]
                ); // Show conditional fields only if any row has litigation/arbitration
              })
              .map((key, idx) => {
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
                        {typeof data[key as keyof TableRow] === "boolean"
                          ? data[key as keyof TableRow]
                            ? "Yes"
                            : "No"
                          : data[key as keyof TableRow]}
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
