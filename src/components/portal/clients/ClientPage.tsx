import { NavLink, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getSingleClient } from "@/store/data";
import {
  getContractsByClient,
  getContractDownloadUrl,
  syncClientContractStatus,
  type ContractListItem,
} from "@/api/api";
import { House, Mail, MapPin, Phone, FileText, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [downloadingContractId, setDownloadingContractId] = useState<number | null>(null);

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

  const fetchContracts = useCallback(() => {
    const id = clientData?.client?.id;
    if (!id) return;
    setContractsLoading(true);
    syncClientContractStatus(id)
      .catch(() => {})
      .then(() => getContractsByClient(id))
      .then(setContracts)
      .catch(() => setContracts([]))
      .finally(() => setContractsLoading(false));
  }, [clientData?.client?.id]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Refetch contracts when user returns to this tab (e.g. after sending from contract page)
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchContracts();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [fetchContracts]);

  const handleDownloadSigned = async (contractId: number) => {
    setDownloadingContractId(contractId);
    try {
      const { url } = await getContractDownloadUrl(contractId);
      window.open(url, "_blank");
    } catch {
      // Error could be shown via toast if you add useToast
    } finally {
      setDownloadingContractId(null);
    }
  };

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
    new Set(clientData.properties.map((p) => p.cadCounty))
  );
  const filteredProperties = clientData.properties.filter((p) =>
    selectedCounty === "All" ? true : p.cadCounty === selectedCounty
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
          <NavLink to={`/portal/contract?clientId=${clientData.client.id}`}>
            <Button variant={"blue"} className="w-full">
              Create Contract
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
                <td>{clientData.client.clientName}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.client.phoneNumber}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.client.email}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.client.mailingAddress},{" "}
                  {clientData.client.mailingAddressCityTxZip}
                </td>
              </tr>
              {(clientData.client.contingencyFee != null && clientData.client.contingencyFee !== "") && (
                <tr>
                  <td className="font-medium">Contingency Fee:</td>
                  <td>{clientData.client.contingencyFee}%</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Associated Property(s)</h1>
          <NavLink
            to={`/portal/add-property?clientId=${clientData.client.id}`}
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

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Contracts & AOAs</h2>
          <Button
            variant="outline"
            size="sm"
            disabled={contractsLoading}
            onClick={() => fetchContracts()}
          >
            {contractsLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh status"
            )}
          </Button>
        </div>
        {contractsLoading ? (
          <div className="flex items-center gap-2 text-gray-600 py-4">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading contracts...
          </div>
        ) : contracts.length === 0 ? (
          <p className="text-gray-600">No contracts or AOAs yet.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Property</th>
                  <th className="text-left p-3 font-medium">Signed at</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3">
                      {c.type === "AOA" ? "AOA" : "Client contract"}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          c.status === "COMPLETED"
                            ? "default"
                            : c.status === "DECLINED" || c.status === "VOIDED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {c.property?.accountNumber ?? "—"}
                    </td>
                    <td className="p-3">
                      {c.signedAt
                        ? new Date(c.signedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      {c.status === "COMPLETED" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={downloadingContractId === c.id}
                          onClick={() => handleDownloadSigned(c.id)}
                        >
                          {downloadingContractId === c.id ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4 mr-1" />
                          )}
                          Download signed
                        </Button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPage;

const PropertyBox: React.FC<Property> = ({
  id,
  accountNumber,
  nameOnCad,
  cadCounty,
}) => {
  return (
    <NavLink to={`/portal/property?propertyId=${id}`} className="block">
      <div className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-tr from-white to-gray-50 hover:from-blue-50 cursor-pointer h-full flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <House size={24} className="text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            {accountNumber}
          </h2>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium text-gray-700">County:</span> {cadCounty}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-700">CAD Details:</span>{" "}
          {nameOnCad}
        </div>
      </div>
    </NavLink>
  );
};
