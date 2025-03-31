import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleProspect } from "@/store/data";
import { LoaderCircle, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property, Prospect } from "@/types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  changeProspectStatus,
  downloadSignedPDF,
  sendContract,
} from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import ViewProspectProperty from "./ViewProspectProperty";
import { Download } from "lucide-react";

interface ProspectData {
  prospect: Prospect;
  properties: Property[];
}
const statusColors = {
  NOT_CONTACTED: "bg-red-100 text-red-800 hover:bg-red-200", // Light red
  CONTACTED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", // Light yellow
  IN_PROGRESS: "bg-green-100 text-green-800 hover:bg-green-200", // Light green
};

const ProspectPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [clientData, setClientData] = useState<ProspectData | null>(null);
  const [isSending, setIsSending] = useState(false); // Track sending state

  const { toast } = useToast();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (id) {
          const response = await getSingleProspect({ prospectId: id });
          setClientData(response);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]);

  if (!clientData) {
    return (
      <div className="text-center text-gray-500">Loading client data...</div>
    );
  }
  const hasProperties = clientData.properties.length > 0;
  const isSendDisabled =
    !hasProperties ||
    clientData.prospect.status === "IN_PROGRESS" ||
    clientData.prospect.status === "SIGNED";

  const handleSendContract = async (id: number) => {
    setIsSending(true);
    try {
      await sendContract({ prospectId: id });
      toast({
        title: "Contract Sent Successfully",
        description: `Contract Sent to id:${id}`,
      });
      setClientData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          prospect: {
            ...prevData.prospect,
            status: "IN_PROGRESS",
          },
        };
      });
      if (clientData?.prospect.status === "CONTACTED") {
        await changeProspectStatus({
          prospectId: id,
          newStatus: "IN_PROGRESS",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send contract",
        description: "Please try again",
      });
    } finally {
      setIsSending(false);
    }
  };
  const handleDownloadSignedPDF = async (id: number) => {
    try {
      console.log("DOWNLOAD FOR:", { id });
      await downloadSignedPDF({ prospectId: id });
      toast({
        title: "Contract Downloaded Successfully",
        description: `Contract Downloaded for id:${id}`,
      });
    } catch (error) {
      console.log("ERROR:", error);
      toast({
        variant: "destructive",
        title: "Failed to download PDF",
        description: "Please try again",
      });
    }
  };

  return (
    <div className="m-2 rounded-lg bg-white p-4">
      <div className="flex justify-between">
        <div className="flex justify-center items-center text-center mb-6 gap-4">
          <h1 className="text-4xl font-bold text-center">Prospect Details</h1>
          <h1
            className={`${
              statusColors[
                clientData.prospect.status as keyof typeof statusColors
              ] || "bg-gray-100 text-gray-800 hover:bg-gray-200"
            } border rounded-lg p-1 text-sm`}
          >
            {clientData.prospect.status}
          </h1>
        </div>
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-full">
                  <Button
                    variant={"blue"}
                    className="w-full"
                    onClick={() => handleSendContract(clientData.prospect.id)}
                    disabled={
                      isSendDisabled ||
                      clientData.prospect.status === "IN_PROGRESS"
                    }
                  >
                    {clientData.prospect.status === "IN_PROGRESS" ? (
                      "Sent"
                    ) : isSending ? (
                      <span className="flex items-center gap-2">
                        <LoaderCircle className="animate-spin w-5 h-5" />
                        Sending...
                      </span>
                    ) : (
                      "Send Contract"
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {isSendDisabled && !hasProperties && (
                <TooltipContent>
                  Add a property before sending the contract
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <NavLink
            to={`/portal/edit-prospect?prospectId=${clientData.prospect.id}`}
          >
            <Button variant={"blue"} className="w-full">
              Edit Prospect Details
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
                <td>{clientData.prospect.ProspectName}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.prospect.PHONENUMBER}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.prospect.Email}
                </td>
              </tr>
              {clientData.prospect.BillingEmail &&
                clientData.prospect.BillingEmail !==
                  clientData.prospect.Email && (
                  <tr>
                    <td className="font-medium">Secondary Email:</td>
                    <td>
                      <Mail size={18} className="inline text-indigo-600 mr-2" />
                      {clientData.prospect.BillingEmail}
                    </td>
                  </tr>
                )}
              <tr>
                <td className="font-medium">Billing Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.prospect.BillingAddress ??
                    `  ${clientData.prospect.MAILINGADDRESS},
                  ${clientData.prospect.MAILINGADDRESSCITYTXZIP}`}
                </td>
              </tr>
              {/* Show Envelope ID and Download Button if status is SIGNED */}
              {clientData.prospect.status === "SIGNED" && (
                <tr>
                  <td className="font-medium">Envelope ID:</td>
                  <td className="text-indigo-600 font-semibold">
                    {clientData.prospect.envelopeId || "N/A"}
                    {clientData.prospect.envelopeId && (
                      <Button
                        variant="blue"
                        className="ml-4 flex items-center gap-2"
                        onClick={() =>
                          handleDownloadSignedPDF(clientData.prospect.id)
                        }
                      >
                        <Download size={18} />
                        Download Signed PDF
                      </Button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-6">Associated Property(ies)</h1>
          <NavLink
            to={`/portal/prospect/add-property?id=${clientData.prospect.id}`}
          >
            <Button variant={"blue"} className="w-full">
              Add Properties
            </Button>
          </NavLink>
        </div>
        {clientData.properties.length ? (
          <div className="flex flex-col gap-4">
            {clientData.properties.map((property) => (
              <ViewProspectProperty
                key={property.id}
                propertyId={`${property.id}`}
                prospectId={parseInt(id!)}
              />
            ))}
          </div>
        ) : (
          <h1 className="text-center">
            No Properties found for this Client...
          </h1>
        )}
      </div>
    </div>
  );
};

export default ProspectPage;
