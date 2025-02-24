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

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (clientId) {
          const response = await getSingleClient({ clientId: clientId });
          console.log("CLINET RES:", response);
          setClientData(response);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  // const renderData = (data: string | null | undefined) => {
  //   return data ? data : "N/A";
  // };

  if (!clientData) {
    return (
      <div className="text-center text-gray-500">Loading client data...</div>
    );
  }

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
        {/* Client Details Table */}
        <div className=" rounded-xl p-4 w-full">
          {/* <h2 className="font-semibold text-lg mb-2">Client Details</h2> */}
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Client Name:</td>
                <td>{clientData?.client.CLIENTNAME}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {clientData?.client.PHONENUMBER}
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
                  {clientData.client.MAILINGADDRESS},
                  {clientData.client.MAILINGADDRESSCITYTXZIP}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold  mb-6">Associated Property(s)</h1>
          <NavLink
            to={`/portal/add-property?clientId=${clientData.client.CLIENTNumber}`}
          >
            <Button variant={"blue"} className="w-full">
              Add Properties
            </Button>
          </NavLink>
        </div>
        {clientData.properties.length ? (
          <div className="flex flex-col gap-4">
            {clientData.properties.map((property) => (
              <div className="">
                <PropertyBox
                  key={property.id}
                  AccountNumber={property.AccountNumber}
                  NAMEONCAD={property.NAMEONCAD}
                  id={property.id}
                  IsArchived={property.IsArchived}
                  createdAt={property.createdAt}
                  updatedAt={property.updatedAt}
                />
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-center ">
            No Properties found for this Client...
          </h1>
        )}
      </div>
    </div>
  );
};

export default ClientPage;

const PropertyBox: React.FC<Property> = ({ id, AccountNumber, NAMEONCAD }) => {
  return (
    <div className="flex border border-red-100 rounded-xl p-4 align-center items-center gap-4 w-max">
      <House />
      <div className="flex flex-col ">
        <NavLink to={`/portal/property?propertyId=${id}`}>
          <h2 className="text-xl font-bold text-green-800">{AccountNumber}</h2>
        </NavLink>
        <div>CAD Details: {NAMEONCAD}</div>
      </div>
    </div>
  );
};
