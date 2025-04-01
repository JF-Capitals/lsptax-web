import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  downloadInvoicesCSV,
  getAllInvoices,
  getArchiveInvoices,
} from "@/store/data";
import TableBuilder from "../TableBuilder";
import { Archive, Download, LoaderCircle } from "lucide-react";

interface InvoicesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const InvoicesTable = <TData, TValue>({
  columns,
}: InvoicesTableProps<TData, TValue>) => {
  const [invoices, setInvoices] = useState<TData[]>([]);
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const handleCsvDownload = async () => {
    setDownloadingCsv(true);
    try {
      await downloadInvoicesCSV();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setError("Failed to download CSV. Please try again later.");
    } finally {
      setDownloadingCsv(false);
    }
  };

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state before fetching
      const response = archived
        ? await getArchiveInvoices()
        : await getAllInvoices();
      // console.log("Fetched invoices:", response);
      setInvoices(response);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      setError("Failed to load invoices. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [archived]);

  if (loading) {
    return (
      <div className="flex justify-center h-full items-center py-20">
        <LoaderCircle className="animate-spin w-16 h-16 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-red-500">
        <span className="text-lg font-semibold">{error}</span>
        <Button variant="blue" className="mt-4" onClick={fetchInvoiceData}>
          Retry
        </Button>
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
        <Button variant={"blue"} onClick={() => setArchived(!archived)}>
          <Archive />
          {archived ? "View Active Invoices" : "View Archive"}
        </Button>
        <Button onClick={handleCsvDownload} disabled={downloadingCsv}>
          {downloadingCsv ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Download />
          )}
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
