import { Invoice } from "@/types/types";
import React, { useState } from "react";

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

const EditableYearTable: React.FC<{ invoices?: Invoice[] }> = ({
  invoices,
}) => {
  const years = [2021, 2022, 2023, 2024, 2025];
  console.log({ invoices });
  // Prepare initial table data from invoices
  const initialTableData: TableRow[] = years.map((year) => {
    const yearData = invoices?.find((invoice) => invoice.year === year);

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

  const [tableData, setTableData] = useState<TableRow[]>(initialTableData);

  // Handle input change for text inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnKey: keyof TableRow
  ) => {
    const { value } = e.target;
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnKey]: value } : row
      )
    );
  };

  // Handle input change for checkboxes
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnKey: keyof TableRow
  ) => {
    const { checked } = e.target;
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnKey]: checked } : row
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Editable Yearly Invoices Summary
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
            {Object.keys(tableData[0]).map((key) => {
              if (key === "year") return null; // Skip "year" column
              return (
                <tr
                  key={key}
                  className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
                >
                  <td className="px-6 py-3 text-sm font-medium text-gray-800">
                    {key}
                  </td>
                  {tableData.map((row, rowIndex) => (
                    <td
                      key={`${row.year}-${key}`}
                      className="px-6 py-3 text-sm text-gray-700"
                    >
                      {key === "Under Litigation" ||
                      key === "Under Arbitration" ? (
                        <div className="flex gap-4 justify-center items-center">
                          <input
                            type="checkbox"
                            checked={row[key as keyof TableRow] as boolean}
                            onChange={(e) =>
                              handleCheckboxChange(
                                e,
                                rowIndex,
                                key as keyof TableRow
                              )
                            }
                            className="form-checkbox h-5 w-5 text-indigo-600"
                          />
                          <span>Yes</span>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={row[key as keyof TableRow] as string}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              rowIndex,
                              key as keyof TableRow
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      )}
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

export default EditableYearTable;
