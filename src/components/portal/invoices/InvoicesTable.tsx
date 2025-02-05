import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  getAllInvoices,
} from "@/store/data";
import TableBuilder from "../TableBuilder";
import { Archive, LoaderCircle } from "lucide-react";

interface InvoicesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const InvoicesTable = <TData, TValue>({
  columns,
}: InvoicesTableProps<TData, TValue>) => {
  // const location = useLocation();
  const [invoices, setInvoices] = useState<TData[]>([]);
  const [archived, setArchived] = useState(false);
  // const [filteredInvoices, setFilteredInvoices] = useState<TData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        const response = await getAllInvoices();
        setInvoices(response);
        setLoading(false);
        console.log({response})
      } catch (error) {
        setError("Failed to load clients. Please try again later.");
        console.error("Error fetching invoice data:", error);
      }
    };
      fetchInvoiceData();

  }, []);

  if (loading) {
    return (
      <div className="flex justify-center h-full items-center py-20">
        <LoaderCircle className="animate-spin w-16 h-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex border rounded-xl items-center gap-4 bg-white m-4 p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold">{invoices.length}</h2>
          <h3>Total number of Invoices</h3>
        </div>
        <Button
          variant={"blue"}
          className=""
          onClick={() => setArchived(!archived)}
        >
          <Archive />
          {archived ? "View Active Invoices" : "View Archive"}
        </Button>
      </div>
      <TableBuilder
        data={invoices}
        columns={columns}
        label="Filtered Invoices"
      />
    </div>
  );
};

export default InvoicesTable;
