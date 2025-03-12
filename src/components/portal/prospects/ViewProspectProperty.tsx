import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { getProspectProperty } from "@/store/data";
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/types";

const ViewProspectProperty = ({ propertyId }: { propertyId: string }) => {
  const [property, setProperty] = useState<PropertyData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        console.log({ propertyData });
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    console.log({ property });
  }, [searchParams, propertyId]); // Trigger when searchParams changes

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
    console.log({ property });
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
      {/* <div className="flex flex-col md:flex-row justify-between ">
        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
          <NavLink
            to={`/portal/edit-properties?propertyId=${property.propertyDetails.id}`}
          >
            <Button className="w-full">Edit Property</Button>
          </NavLink>
        </div>
      </div> */}

      <div className="flex flex-col md:flex-row align-center items-center justify-between items-center border rounded-xl bg-gray-100 my-2 p-4">
        <div className="text-lg">
          <h1 className="flex gap-2">
            Property No:
            <p className="font-bold">
              #{property.propertyDetails.AccountNumber}
            </p>
          </h1>
        </div>
        <NavLink
          to={`/portal/edit-prospect-properties?id=${property.propertyDetails.id}`}
        >
          <Button className="w-full">Edit Property</Button>
        </NavLink>
      </div>

      <div className="gap-2 flex flex-col md:flex-row justify-between ">
        {/* Client Details Table */}
        {/* <div className="border rounded-xl p-4 w-full">
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
        </div> */}

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
