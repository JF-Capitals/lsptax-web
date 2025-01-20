import { Invoice } from "@/types/types";
// import formatDate from "@/utils/formatDate";
import React from "react";

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

const YearTable: React.FC<{ invoices: Invoice[] }> = ({ invoices }) => {
  // Extract data for the table: creating rows and columns
  console.log({ invoices });
  const years = [2021, 2022, 2023, 2024, 2025];
  const rowData = years.map((year) => {
    const yearData = invoices.find((invoice) => invoice.year === year);

    return {
      year,
      "Protested Date": "-",
      "BPP Rendered": "",
      "Prelim Land": yearData?.BPPInvoice || "N/A",
      "Prelim Building":  yearData?.BPPInvoicePaid || "N/A",
      "Prelim Total":  yearData?.NoticeMarketValue || "N/A",
      "Assessed Prelim": "",
      "Final Land": "",
      "Final Building": "",
      "Final Total": "",
      "Assessed Final": "",
      "Hearing Date": "",
      "Invoice Date": "",
      "Under Litigation": "",
      "Under Arbitration": "",
      "Reduction": "",
      "Tax Rate": "",
      "Taxes Saved": "",
      "Contingency Fee":  yearData
        ? yearData.ArbitrationContingencyFee
        : "N/A",
      "Invoice Amount": yearData ? yearData.TotalDue : "N/A",
      "Paid Date": "",
      "Payment Notes": "",
      // FinalMarketValue: yearData ? yearData.FinalMarketValue : "N/A",
      // MarketValueReduction: yearData ? yearData.MarketValueReduction : "N/A",
      // NoticeAppraisedValue: yearData ? yearData.NoticeAppraisedValue : "N/A",
      // FinalAppraisedValue: yearData ? yearData.FinalAppraisedValue : "N/A",
      // ValueAppraisedValueReduction: yearData
      //   ? yearData.ValueAppraisedValueReduction
      //   : "N/A",
      // ValueOverallTaxRate: yearData ? yearData.ValueOverallTaxRate : "N/A",
      // ValueTaxSavings: yearData ? yearData.ValueTaxSavings : "N/A",
      // Contingency: yearData ? yearData.Contingency : "N/A",
      // ContingencyFeeDue: yearData ? yearData.ContingencyFeeDue : "N/A",
      // TaxBPPBPPLastYearAppraised: yearData
      //   ? yearData.TaxBPPBPPLastYearAppraised
      //   : "N/A",
      // TaxBPPFinalAppraisedTotal: yearData
      //   ? yearData.TaxBPPFinalAppraisedTotal
      //   : "N/A",
      // TaxBPPAppraisedValueReduction: yearData
      //   ? yearData.TaxBPPAppraisedValueReduction
      //   : "N/A",
      // TaxBPPOverallTaxRate: yearData ? yearData.TaxBPPOverallTaxRate : "N/A",
      // TaxBPPTaxSavings: yearData ? yearData.TaxBPPTaxSavings : "N/A",
      // TaxBPPContingencyFee: yearData ? yearData.TaxBPPContingencyFee : "N/A",
      // TaxBPPDue: yearData ? yearData.TaxBPPDue : "N/A",
      // JustBPPBPPLastYearAppraised: yearData
      //   ? yearData.JustBPPBPPLastYearAppraised
      //   : "N/A",
      // BPPThisYearAppraised: yearData ? yearData.BPPThisYearAppraised : "N/A",
      // ProtestInvoice: yearData ? yearData.ProtestInvoice : "N/A",
      // ProtestInvoicePaid: yearData ? yearData.ProtestInvoicePaid : "N/A",
      // ONLYMarketChangeInARB: yearData ? yearData.ONLYMarketChangeInARB : "N/A",
      // NoticeAppraisedTotal: yearData ? yearData.NoticeAppraisedTotal : "N/A",
      // ArbitrationFinalAppraisedTotal: yearData
      //   ? yearData.ArbitrationFinalAppraisedTotal
      //   : "N/A",
      // ArbitrationAppraisedValueReduction: yearData
      //   ? yearData.ArbitrationAppraisedValueReduction
      //   : "N/A",
      // ArbitrationOverallTaxRate: yearData
      //   ? yearData.ArbitrationOverallTaxRate
      //   : "N/A",
      // TaxSavings: yearData ? yearData.TaxSavings : "N/A",
      // ArbitrationContingencyFee: yearData
      //   ? yearData.ArbitrationContingencyFee
      //   : "N/A",
      // ArbitrationDue: yearData ? yearData.ArbitrationDue : "N/A",
      // ARBFee: yearData ? yearData.ARBFee : "N/A",
      // ComptrollerRefundCK: yearData ? yearData.ComptrollerRefundCK : "N/A",
      // CollectOrRefund: yearData ? yearData.CollectOrRefund : "N/A",
      // ARBInvoice: yearData ? yearData.ARBInvoice : "N/A",
      // ClientPaidOrArbRefundUsed: yearData
      //   ? yearData.ClientPaidOrArbRefundUsed
      //   : "N/A",
      // TotalDue: yearData ? yearData.TotalDue : "N/A",
      // TypeOfService: yearData ? yearData.TypeOfService : "N/A",
      // AnyRandamServiceInvoice: yearData
      //   ? yearData.AnyRandamServiceInvoice
      //   : "N/A",
      // RandomServiceFeeInvoicePaid: yearData
      //   ? yearData.RandomServiceFeeInvoicePaid
      //   : "N/A",
      // LastYearAppraised: yearData ? yearData.LastYearAppraised : "N/A",
      // Value2525FinalAppraisedTotal: yearData
      //   ? yearData.Value2525FinalAppraisedTotal
      //   : "N/A",
      // Value2525AppraisedValueReduction: yearData
      //   ? yearData.Value2525AppraisedValueReduction
      //   : "N/A",
      // Value2525OverallTaxRate: yearData
      //   ? yearData.Value2525OverallTaxRate
      //   : "N/A",
      // Value2525TaxSavings: yearData ? yearData.Value2525TaxSavings : "N/A",
      // Value2525ContingencyFee: yearData
      //   ? yearData.Value2525ContingencyFee
      //   : "N/A",
      // Value2525Due: yearData ? yearData.Value2525Due : "N/A",
      // PastDue: yearData ? yearData.PastDue : "N/A",
      // PastDuePaid: yearData ? yearData.PastDuePaid : "N/A",
      // IsArchived: yearData ? yearData.IsArchived : false,
      // createdAt: yearData ? yearData.createdAt : new Date(),
      // updatedAt: yearData ? yearData.updatedAt : new Date(),
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
              <th className="px-6 py-3 text-sm font-medium uppercase">
              
              </th>
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
