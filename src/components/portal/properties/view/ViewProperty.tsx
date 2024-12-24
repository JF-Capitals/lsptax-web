import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import {
  getContractOwnerById,
  getSingleClient,
  getSingleProperty,
} from "@/store/data";
import { Mail, MapPin, Phone } from "lucide-react";
import formatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import TableBuilder from "../../TableBuilder";
import YearTable from "../yeardata/YearTable";
import { propertyYearDataColumn } from "../yeardata/columns";

const ViewProperty = () => {
  const [property, setProperty] = useState<any>(null);
  const [propertyYearData, setPropertyYearData] = useState<any[]>([]);
  const [client, setClient] = useState<any>(null);
  const [contractOwner, setContractOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProperty = async () => {
      const propertyId = Number(searchParams.get("propertyId"));
      if (!propertyId) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }

      try {
        const propertyData = await getSingleProperty({ propertyId });
        console.log("DATA AT 31:", propertyData.property_year_data);
        setPropertyYearData(propertyData.property_year_data);
        if (propertyData && propertyData.property.length > 0) {
          const fetchedProperty = propertyData.property[0];
          setProperty(fetchedProperty); // Set the property state
          console.log("PROP AT 34:", fetchedProperty);
          console.log({ propertyYearData });
          // Use fetchedProperty directly to avoid relying on stale state
          const clientId = fetchedProperty.ls_prop_client_id;
          const clientData = await getSingleClient({ clientId });
          setClient(clientData);
          if (clientData) {
            const coId = clientData.ls_client_co_id;
            console.log("co id at 34:", coId);
            const contractOwnerResponse = await getContractOwnerById({ coId });
            console.log("data at 38:", contractOwnerResponse);
            setContractOwner(contractOwnerResponse[0]);
          } else {
            console.log("no client");
          }
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [searchParams]);

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
    <div className="w-full p-4 bg-white shadow-md rounded-lg ">
      <div className="flex flex-col md:flex-row justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 ">
          View Property
        </h1>
        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
          <NavLink
            to={`/portal/edit-properties?propertyId=${property.ls_prop_id}`}
          >
            <Button className="w-full">Edit Property</Button>
          </NavLink>

          <NavLink to={`/portal/invoices?propertyId=${property.ls_prop_id}`}>
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
            <p className="font-bold">#{property.ls_prop_id}</p>
          </h1>
          <h2 className="flex gap-2">
            Client No:
            <p className="font-bold">#{property.ls_prop_account_number}</p>
          </h2>
        </div>
      </div>

      <div className="gap-2 flex flex-col md:flex-row justify-between">
        {/* Client Details Table */}
        <div className="border rounded-xl p-4 w-full">
          <h2 className="font-semibold text-lg mb-2">Client Details</h2>
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Client:</td>
                <td>{client.ls_client_fname + " " + client.ls_client_lname}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {client.ls_client_mobile || client.ls_client_phone}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {client.ls_client_email}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {client.ls_client_street + " "}
                  {client.ls_client_city + " "}
                  {client.ls_client_state + " "}
                  {client.ls_client_zip + " "}
                  {client.ls_client_country}
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
                <td className="font-medium">Added On:</td>
                <td>{formatDate(property.ls_prop_added_on)}</td>
              </tr>
              <tr>
                <td className="font-medium">Type:</td>
                <td>{property.ls_prop_type}</td>
              </tr>
              <tr>
                <td className="font-medium">Class:</td>
                <td>{property.ls_prop_class}</td>
              </tr>
              <tr>
                <td className="font-medium">Assessor:</td>
                <td>{property.ls_prop_assessor}</td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  {property.ls_prop_street + " "}
                  {property.ls_prop_city + " "}
                  {property.ls_prop_state + " "}
                  {property.ls_prop_zip}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Status:</td>
                <td>{property.ls_prop_status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-2 flex-col md:flex-row">
        {/* CAD Owner Details */}
        <div className="border rounded-xl p-4 mt-2 w-full">
          <h2 className="font-semibold text-lg mb-2">CAD Owner Details</h2>
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">CAD Owner:</td>
                <td>{property.ls_prop_cad_owner}</td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>{property.ls_prop_cad_address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Contract Type Details */}
        <div className="border rounded-xl p-4 mt-2 w-full">
          <h2 className="font-semibold text-lg mb-2">Contract Type</h2>
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Contract Type:</td>
                <td>{property.ls_prop_class}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Owner Details */}
      <div className="border rounded-xl p-4 mt-2">
        <h2 className="font-semibold text-lg mb-2">Contract Owner Details</h2>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-medium">Owner Name:</td>
              <td>
                {" "}
                {contractOwner.ls_co_fname + " " + contractOwner.ls_co_lname}
              </td>
            </tr>
            <tr>
              <td className="font-medium">Phone:</td>
              <td>{contractOwner.ls_co_phone}</td>
            </tr>
            <tr>
              <td className="font-medium">Email:</td>
              <td>{contractOwner.ls_co_email}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="">
        <TableBuilder
          data={propertyYearData}
          columns={propertyYearDataColumn}
          label={"Year Table"}
        />
      </div>
    </div>
  );
};

export default ViewProperty;
