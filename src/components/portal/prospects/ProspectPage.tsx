import { NavLink, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getSingleProspect } from "@/store/data";
import {
  getContractsByClient,
  getContractDownloadUrl,
  syncClientContractStatus,
  type ContractListItem,
} from "@/api/api";
import { House, LoaderCircle, Mail, MapPin, Phone, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property, Prospect } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface ProspectData {
  prospect: Prospect;
  properties: Property[];
}

const statusColors: Record<string, string> = {
  NOT_CONTACTED: "bg-red-100 text-red-800 hover:bg-red-200",
  CONTACTED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  IN_PROGRESS: "bg-green-100 text-green-800 hover:bg-green-200",
  SIGNED: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const ProspectPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [prospectData, setProspectData] = useState<ProspectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string>("All");
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [downloadingContractId, setDownloadingContractId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchProspectData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getSingleProspect({ prospectId: id });
      setProspectData(response ?? null);
    } catch (e) {
      console.error("Error fetching prospect:", e);
      setError("Failed to load prospect.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProspectData();
  }, [fetchProspectData]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchProspectData();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [fetchProspectData]);

  const fetchContracts = useCallback(() => {
    const prospectId = prospectData?.prospect?.id;
    if (!prospectId) return;
    setContractsLoading(true);
    syncClientContractStatus(prospectId)
      .catch(() => {})
      .then(() => getContractsByClient(prospectId))
      .then(setContracts)
      .catch(() => setContracts([]))
      .finally(() => setContractsLoading(false));
  }, [prospectData?.prospect?.id]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

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
      toast({
        title: "Download started",
        description: "Signed document opened in a new tab.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Could not download signed PDF.",
      });
    } finally {
      setDownloadingContractId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Loading prospect data...
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

  if (!prospectData) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No prospect data available.
      </div>
    );
  }

  const { prospect, properties } = prospectData;

  const uniqueCounties = Array.from(
    new Set(properties.map((p) => p.cadCounty ?? p.CADCOUNTY).filter(Boolean))
  ) as string[];
  const filteredProperties = properties.filter((p) => {
    const county = p.cadCounty ?? p.CADCOUNTY;
    return selectedCounty === "All" ? true : county === selectedCounty;
  });

  return (
    <div className="m-2 rounded-lg bg-white p-4">
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-4 mb-6">
          <h1 className="text-4xl font-bold text-center">Prospect Details</h1>
          <span
            className={`${
              statusColors[prospect.status] ?? "bg-gray-100 text-gray-800 hover:bg-gray-200"
            } border rounded-lg px-2 py-1 text-sm font-medium`}
          >
            {prospect.status}
          </span>
        </div>
        <div className="flex gap-4">
          <NavLink to={`/portal/edit-prospect?prospectId=${prospect.id}`}>
            <Button variant="blue" className="w-full">
              Edit Prospect Details
            </Button>
          </NavLink>
          <NavLink to={`/portal/prospect/contract?id=${id}`}>
            <Button variant="blue" className="w-full">
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
                <td>{prospect.clientName}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {prospect.phoneNumber}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {prospect.email}
                </td>
              </tr>
              {prospect.billingEmail && prospect.billingEmail !== prospect.email && (
                <tr>
                  <td className="font-medium">Secondary Email:</td>
                  <td>
                    <Mail size={18} className="inline text-indigo-600 mr-2" />
                    {prospect.billingEmail}
                  </td>
                </tr>
              )}
              <tr>
                <td className="font-medium">Billing Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {prospect.billingAddress ??
                    [prospect.mailingAddress, prospect.mailingAddressCityTxZip].filter(Boolean).join(", ")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
          <p className="text-gray-600">No contracts or AOAs yet. Use &quot;Create Contract&quot; to preview and send.</p>
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

      <div>
        <div className="flex justify-between items-center mb-4 mt-8">
          <h1 className="text-2xl font-bold">Associated Property(s)</h1>
          <NavLink to={`/portal/prospect/add-property?id=${prospect.id}`}>
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
              <ProspectPropertyBox key={property.id} property={property} />
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

export default ProspectPage;

const ProspectPropertyBox: React.FC<{ property: Property }> = ({
  property,
}) => {
  const accountNumber = property.accountNumber ?? property.AccountNumber;
  const cadCounty = property.cadCounty ?? property.CADCOUNTY;
  const nameOnCad = property.nameOnCad ?? property.NAMEONCAD;

  return (
    <NavLink
      to={`/portal/edit-prospect-properties?id=${property.id}`}
      className="block"
    >
      <div className="border rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-300 bg-gradient-to-tr from-white to-gray-50 hover:from-blue-50 cursor-pointer h-full flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <House size={24} className="text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            {accountNumber ?? "—"}
          </h2>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium text-gray-700">County:</span> {cadCounty ?? "—"}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-700">CAD Details:</span>{" "}
          {nameOnCad ?? "—"}
        </div>
      </div>
    </NavLink>
  );
};
