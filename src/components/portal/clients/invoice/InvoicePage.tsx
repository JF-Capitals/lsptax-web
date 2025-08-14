import { getInvoice } from "@/store/data";
import { InvoiceData } from "@/types/types";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceDetails from "./InvoiceDetails";

const InvoicePage = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        if (clientId) {
                  const response = await getInvoice({ clientId: clientId });
        setInvoiceData(response);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    if (clientId) {
      fetchInvoiceData();
    }
  }, [clientId]);

  if (!invoiceData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-700">Loading data...</p>
        </div>
      </div>
    );
  }

  // Validate that invoiceData has the expected structure
  if (!invoiceData.client || !invoiceData.properties || !Array.isArray(invoiceData.properties)) {
    console.error('Invalid invoice data structure:', invoiceData);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg font-semibold text-red-700">Error: Invalid data structure</p>
          <p className="text-sm text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InvoiceSummary
        invoice={invoiceData}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <InvoiceDetails invoice={invoiceData} selectedYear={selectedYear} />
    </div>
  );
};

export default InvoicePage;
