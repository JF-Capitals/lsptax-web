import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  getArchiveInvoices,
  getInvoices,
  getInvoiceByPropertyId,
  getAllInvoices,
} from "@/store/data";
import TableBuilder from "../TableBuilder";
import { Archive, ChevronDown, LoaderCircle } from "lucide-react";

interface InvoicesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const InvoicesTable = <TData, TValue>({
  columns,
}: InvoicesTableProps<TData, TValue>) => {
  const location = useLocation();
  const [invoices, setInvoices] = useState<TData[]>([]);
  const [archived, setArchived] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState<TData[]>([]);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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
          <h2 className="text-2xl font-bold">{filteredInvoices.length}</h2>
          <h3>Total number of Invoices</h3>
        </div>
        <div className="w-full">
          <h2>Type</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {typeFilter || "All Types"} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={typeFilter || "All"}
                onValueChange={(value) =>
                  setTypeFilter(value === "All" ? null : value)
                }
              >
                <DropdownMenuRadioItem value="All">
                  All Types
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Protest">
                  Protest
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Arbitration">
                  Arbitration
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full">
          <h2>Status</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {statusFilter || "All Statuses"} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={statusFilter || "All"}
                onValueChange={(value) =>
                  setStatusFilter(value === "All" ? null : value)
                }
              >
                <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Completed">
                  Completed
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pending">
                  Pending
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
