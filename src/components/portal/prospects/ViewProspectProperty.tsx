import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { getProspectProperty } from "@/store/data";
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { deleteProspectProperty } from "@/api/api";

const ViewProspectProperty = ({ propertyId,prospectId }: { propertyId: string, prospectId:number }) => {
  const { toast } = useToast();
  const [property, setProperty] = useState<PropertyData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // Track deletion state
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }

      try {
        const propertyData = await getProspectProperty({ propertyId });
        setProperty(propertyData);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [searchParams, propertyId]); // Trigger when searchParams changes

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProspectProperty(propertyId);
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
      });
      // Redirect or refresh after deletion
      window.location.href = `/portal/prospect?id=${prospectId}`;
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete property. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
    <div className="w-full p-4 bg-white border rounded-lg">
      <div className="flex flex-col md:flex-row align-center items-center justify-between items-center border rounded-xl bg-gray-100 my-2 p-4">
        <div className="text-lg">
          <h1 className="flex gap-2">
            Property No:
            <p className="font-bold">
              #{property.propertyDetails.AccountNumber}
            </p>
          </h1>
        </div>
        <div className="flex gap-4">
          <NavLink
            to={`/portal/edit-prospect-properties?id=${property.propertyDetails.id}`}
          >
            <Button className="w-full">Edit Property</Button>
          </NavLink>

          {/* Delete Property Button */}
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

      <div className="gap-2 flex flex-col md:flex-row justify-between ">
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
    </div>
  );
};

export default ViewProspectProperty;
