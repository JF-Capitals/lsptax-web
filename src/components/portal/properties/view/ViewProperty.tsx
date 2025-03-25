import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { getSingleProperty } from "@/store/data";
import { ChevronDown, ChevronUp, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/types";
import { deleteProperty } from "@/api/api";
import YearTable from "../yeardata/YearTable";
import { useToast } from "@/hooks/use-toast";

const ViewProperty = () => {
  const { toast } = useToast();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // Track deletion state
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false); // Track invoice section state
  const [searchParams, setSearchParams] = useSearchParams();
  const propertyId = parseInt(searchParams.get("propertyId") || "1");

  const fetchProperty = async (id: number) => {
    setLoading(true);
    setError("");
    setProperty(null);

    try {
      const propertyData = await getSingleProperty({
        propertyId: id.toString(),
      });

      if (!propertyData) {
        toast({
          variant: "destructive",
          title: "Property Not Found",
          description: `Property with ID ${id} not found. Fetching the next property...`,
        });

        // Automatically fetch the next property
        setSearchParams({ propertyId: (id + 1).toString() });
        return;
      }

      setProperty(propertyData);
    } catch (err) {
      console.error("Error fetching property:", err);
      setError("Failed to fetch property details");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = async (
    newId: number,
    direction: "prev" | "next"
  ) => {
    let currentId = newId;

    while (true) {
      const propertyData = await getSingleProperty({
        propertyId: currentId.toString(),
      });

      if (propertyData) {
        setSearchParams({ propertyId: currentId.toString() });
        break;
      }

      // Adjust the ID based on the direction
      currentId = direction === "prev" ? currentId - 1 : currentId + 1;

      // Prevent infinite loops
      if (currentId <= 0) {
        toast({
          variant: "destructive",
          title: "No more properties",
          description: "You have reached the beginning of the property list.",
        });
        break;
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProperty(propertyId.toString());

      toast({
        title: "✓ Property deleted successfully",
        description: "The property has been deleted from the system.",
      });

      // Redirect to the next property
      setSearchParams({ propertyId: (propertyId + 1).toString() });
    } catch (error) {
      console.error("Error deleting property:", error);
      if (error instanceof Error) {
        toast({
          title: "Error deleting property",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProperty(propertyId);
  }, [propertyId]); // Refetch when propertyId changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">
          No property details to display
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between ">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">View Property</h1>
        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
          <NavLink
            to={`/portal/edit-properties?propertyId=${property.propertyDetails.id}`}
          >
            <Button className="w-full">Edit Property</Button>
          </NavLink>

          <NavLink
            to={`/portal/invoices?propertyId=${property.propertyDetails.AccountNumber}`}
          >
            <Button className="w-full">View Invoices</Button>
          </NavLink>

          <NavLink to={"/editProperty"}>
            <Button className="w-full">Schedule Hearing Date</Button>
          </NavLink>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-full ${
              isDeleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Property"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row align-center items-center justify-between items-center border rounded-xl bg-gray-100 my-2 p-4">
        <h1 className="text-4xl font-bold text-center">
          Lone Star Property Tax
        </h1>
        <div className="text-lg">
          <h1 className="flex gap-2">
            Property No:
            <p className="font-bold">
              #{property.propertyDetails.AccountNumber}
            </p>
          </h1>
          <h2 className="flex gap-2">
            Client No:
            <p className="font-bold">
              #{property.propertyDetails.CLIENTNumber}
            </p>
          </h2>
        </div>
      </div>

      <div className="gap-2 flex flex-col md:flex-row justify-between ">
        {/* Client Details Table */}
        <div className="border rounded-xl p-4 w-full">
          <h2 className="font-semibold text-lg mb-2">Client Details</h2>
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Client:</td>
                <td>{property.clientDetails?.CLIENTNAME}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {property.clientDetails?.PHONENUMBER}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {property.clientDetails?.Email}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {property?.propertyDetails.MAILINGADDRESS},{" "}
                  {property?.propertyDetails.MAILINGADDRESSCITYTXZIP}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Property Details Table */}
        <div className="border rounded-xl p-4 w-full">
          <h2 className="font-semibold text-lg mb-2">Property Details</h2>
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Assessor:</td>
                <td>{property.propertyDetails.CONTACTOWNER}</td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  {property.propertyDetails.CADMailingADDRESS + " "}
                  {property.propertyDetails.CADZIPCODE + " "}
                </td>
              </tr>
              <tr>
                <td className="font-medium">County:</td>
                <td>{property.propertyDetails.CADCOUNTY}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="p-6 bg-gray-50 border rounded-lg my-2">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsInvoiceOpen(!isInvoiceOpen)}
        >
          <h2 className="text-2xl font-bold">Invoice Details</h2>
          <span>{isInvoiceOpen ? "▲" : "▼"}</span>
        </div>
        {isInvoiceOpen && (
          <div className="mt-4">
            <YearTable invoices={property.invoices} />
          </div>
        )}
      </div> */}
      <div
        className="flex justify-between items-center cursor-pointer bg-blue-100 hover:bg-blue-200 p-4 rounded-lg my-2"
        onClick={() => setIsInvoiceOpen(!isInvoiceOpen)}
      >
        <h2 className="text-xl font-semibold text-blue-800">Invoice Details</h2>
        <span className="text-blue-800">
          {isInvoiceOpen ? <ChevronUp /> : <ChevronDown />}
        </span>
      </div>
      <div
        className={` transition-all duration-300 ease-in-out ${
          isInvoiceOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          maxHeight: isInvoiceOpen
            ? `${property.invoices.length * 250}px`
            : "0px",
          opacity: isInvoiceOpen ? 1 : 0,
        }}
      >
        <div className="mt-4">
          <YearTable invoices={property.invoices} />
        </div>
      </div>

      <div className="flex w-full justify-between mt-4">
        <Button
          onClick={() => handleNavigation(propertyId - 1, "prev")}
          disabled={propertyId <= 1}
        >
          Prev
        </Button>
        <Button onClick={() => handleNavigation(propertyId + 1, "next")}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ViewProperty;