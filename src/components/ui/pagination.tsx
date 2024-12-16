import { Button } from "@/components/ui/button";

interface PaginationProps {
  table: any; // Adjust the type if you have a more specific table data type
}

const Pagination = ({ table }: PaginationProps) => {
  const { pageIndex, pageCount } = table.getState().pagination;

  // Generate an array of page numbers to display, including the current page and a few around it
  const pageNumbers: number[] = [];
  const startPage = Math.max(pageIndex - 2, 0); // Show 2 pages before the current page
  const endPage = Math.min(pageIndex + 2, pageCount - 1); // Show 2 pages after the current page

  // Create the page numbers array
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i + 1); // Adjust for 1-based index
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </Button>

      {/* Page numbers */}
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageNumber - 1)} // Convert to zero-based index
          className={
            pageNumber - 1 === pageIndex ? "bg-blue-500 text-white" : ""
          }
        >
          {pageNumber}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </Button>
    </div>
  );
};

export default Pagination;
