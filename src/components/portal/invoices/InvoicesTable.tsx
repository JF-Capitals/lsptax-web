import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  downloadInvoicesCSV,
  getAllInvoices,
  getArchiveInvoices,
} from "@/store/data";
import TableBuilder from "../TableBuilder";
import { Archive, Download, LoaderCircle, Search, X } from "lucide-react";

interface InvoicesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const InvoicesTable = <TData, TValue>({
  columns,
}: InvoicesTableProps<TData, TValue>) => {
  const [invoices, setInvoices] = useState<TData[]>([]);
  const [allInvoices, setAllInvoices] = useState<TData[]>([]); // Store all invoices for filtering
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      setAllInvoices(response);
      setInvoices(response);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      setError("Failed to load invoices. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter invoices based on search term
  const filterInvoices = (term: string) => {
    if (!term.trim()) {
      setInvoices(allInvoices);
      return;
    }

    const filtered = allInvoices.filter((invoice: any) => {
      const searchLower = term.toLowerCase();
      
      // Search by clientId (exact match or starts with)
      const clientId = String(invoice.clientId || '');
      if (clientId.toLowerCase() === searchLower || clientId.toLowerCase().startsWith(searchLower)) {
        return true;
      }
      
      // Search by accountNumber (property numbers) - exact match or starts with
      if (invoice.propertyNumbers && Array.isArray(invoice.propertyNumbers)) {
        return invoice.propertyNumbers.some((prop: any) => {
          const propString = String(prop || '');
          return propString.toLowerCase() === searchLower || propString.toLowerCase().startsWith(searchLower);
        });
      }
      
      // Search by accountNumber field directly (if it exists)
      const accountNumber = String(invoice.accountNumber || '');
      if (accountNumber.toLowerCase() === searchLower || accountNumber.toLowerCase().startsWith(searchLower)) {
        return true;
      }
      
      return false;
    });
    
    setInvoices(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterInvoices(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setInvoices(allInvoices);
  };



  useEffect(() => {
    fetchInvoiceData();
    // Reset search when switching between archived and active
    setSearchTerm("");
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
          <h3>
            {searchTerm ? (
              <>
                Search Results ({invoices.length} of {allInvoices.length})
                {invoices.length === 0 && (
                  <span className="text-red-500 ml-2">No matches found</span>
                )}
              </>
            ) : (
              "Total number of Invoices"
            )}
          </h3>
        </div>
        
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by Client ID, Account Number, or Property Numbers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-10 w-80"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
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
