import { Invoice } from "@/types/types";
import React, { useState } from "react";

// Define the type for table row data
type TableRow = {
  year: number;
  "Protested Date": string;
  "BPP Rendered": string;
  "Prelim Land": string;
  "Prelim Building": string;
  "Prelim Total": string;
  "Assessed Prelim": string;
  "Final Land": string;
  "Final Building": string;
  "Final Total": string;
  "Assessed Final": string;
  "Hearing Date": string;
  "Invoice Date": string;
  "Under Litigation": boolean;
  "Under Arbitration": boolean;
  Reduction: string;
  "Tax Rate": string;
  "Taxes Saved": string;
  "Contingency Fee": string;
  "Invoice Amount": string;
  "Paid Date": string;
  "Payment Notes": string;
};

const EditableYearTable: React.FC<{ invoices?: Invoice[] }> = ({
  invoices,
}) => {
  const years = [2021, 2022, 2023, 2024, 2025];

  // Prepare initial table data from invoices
  const initialTableData: TableRow[] = years.map((year) => {
    const yearData = invoices?.find((invoice) => invoice.year === year);

    return {
      year,
      "Protested Date": "-",
      "BPP Rendered": "",
      "Prelim Land": yearData?.BPPInvoice || "N/A",
      "Prelim Building": yearData?.BPPInvoicePaid || "N/A",
      "Prelim Total": yearData?.NoticeMarketValue || "N/A",
      "Assessed Prelim": "",
      "Final Land": "",
      "Final Building": "",
      "Final Total": "",
      "Assessed Final": "",
      "Hearing Date": "",
      "Invoice Date": "",
      "Under Litigation": false, // Default for checkboxes
      "Under Arbitration": false, // Default for checkboxes
      Reduction: "",
      "Tax Rate": "",
      "Taxes Saved": "",
      "Contingency Fee": yearData?.ArbitrationContingencyFee || "N/A",
      "Invoice Amount": yearData?.TotalDue || "N/A",
      "Paid Date": "",
      "Payment Notes": "",
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
