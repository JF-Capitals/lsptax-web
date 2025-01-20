import { getInvoice } from "@/store/data";
import { InvoiceData} from "@/types/types";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceDetails from "./InvoiceDetails";

const InvoicePage = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        if (clientId) {
          const response = await getInvoice({ clientId: clientId });
          console.log("Invoice RES:", response);
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
  return (
    <div>
      <InvoiceSummary invoice={invoiceData} />
      <InvoiceDetails invoice={invoiceData} />
    </div>
  );
};

export default InvoicePage;
