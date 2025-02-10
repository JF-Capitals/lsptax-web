import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import {
  getSingleProperty,
} from "@/store/data";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/types";
import YearTable from "../yeardata/YearTable";

const ViewProperty = () => {
  const [property, setProperty] = useState<PropertyData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProperty = async () => {
      const propertyId = searchParams.get("propertyId");
      console.log({ propertyId });
      if (!propertyId) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }

      try {
        const propertyData = await getSingleProperty({ propertyId });
        setProperty(propertyData);
        setLoading(false)
        console.log({propertyData})
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    console.log({ property });
  }, [searchParams]); // Trigger when searchParams changes

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
    console.log({property})
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2 ">
          View Property
        </h1>
        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
          <NavLink
            to={`/portal/edit-properties?propertyId=${property.propertyDetails.AccountNumber}`}
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
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border rounded-lg my-2 p-4">
        <h2 className="text-2xl font-bold mb-6">Invoice Details</h2>
        <YearTable invoices={property.invoices}/>
      </div>
    </div>
  );
};

export default ViewProperty;
