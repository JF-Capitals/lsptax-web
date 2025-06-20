import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleClient } from "@/store/data";
import { House, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientData, Property } from "@/types/types";

interface Client {
  client: ClientData;
  properties: Property[];
}

const ClientPage = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [clientData, setClientData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string>("All");

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      setError(null);
      setClientData(null);

      if (!clientId) {
        setError("No client ID provided in the URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await getSingleClient({ clientId });

        if (!response || !response.client) {
          setError("No data found for the specified client ID.");
        } else {
          setClientData(response);
        }
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError(
          "An error occurred while fetching client data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading client data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        {error}
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No client data available.
      </div>
    );
  }

  const uniqueCounties = Array.from(
    new Set(clientData.properties.map((p) => p.CADCOUNTY))
  );
  const filteredProperties = clientData.properties.filter((p) =>
    selectedCounty === "All" ? true : p.CADCOUNTY === selectedCounty
  );

  return (
    <div className="m-2 rounded-lg bg-white p-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold text-center mb-6">Client Details</h1>
        <div className="flex gap-4">
          <NavLink to={`/portal/edit-client?clientId=${clientData.client.id}`}>
            <Button variant={"blue"} className="w-full">
              Edit Client Details
            </Button>
          </NavLink>
          <NavLink to={`/portal/invoice?clientId=${clientData.client.id}`}>
            <Button variant={"blue"} className="w-full">
              Invoice
            </Button>
          </NavLink>
        </div>
      </div>

      <div className="gap-2 flex flex-col md:flex-row justify-between">
        <div className="rounded-xl p-4 w-full">
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Client Name:</td>
                <td>{clientData.client.CLIENTNAME}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.client.PHONENUMBER}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.client.Email}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.client.MAILINGADDRESS},{" "}
                  {clientData.client.MAILINGADDRESSCITYTXZIP}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Associated Property(s)</h1>
          <NavLink
            to={`/portal/add-property?clientId=${clientData.client.CLIENTNumber}`}
          >
            <Button variant={"blue"} className="w-full">
              Add Properties
            </Button>
          </NavLink>
        </div>

        {uniqueCounties.length > 1 && (
          <div className="mb-6">
            <label htmlFor="county-filter" className="mr-2 font-medium">
              Filter by County:
            </label>
            <select
              id="county-filter"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="All">All</option>
              {uniqueCounties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
        )}

        {filteredProperties.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProperties.map((property) => (
              <PropertyBox key={property.id} {...property} />
            ))}
          </div>
        ) : (
          <h1 className="text-center text-gray-600 col-span-full">
            No properties found for the selected county.
          </h1>
        )}
      </div>
    </div>
  );
};

export default ClientPage;

const PropertyBox: React.FC<Property> = ({
  id,
  AccountNumber,
  NAMEONCAD,
  CADCOUNTY,
}) => {
  return (
    <NavLink to={`/portal/property?propertyId=${id}`} className="block">
      <div className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-tr from-white to-gray-50 hover:from-blue-50 cursor-pointer h-full flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <House size={24} className="text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            {AccountNumber}
          </h2>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium text-gray-700">County:</span> {CADCOUNTY}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-700">CAD Details:</span>{" "}
          {NAMEONCAD}
        </div>
      </div>
    </NavLink>
  );
};
