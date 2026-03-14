import { getPreviewDocuments, getSingleProspect } from "@/store/data";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { changeProspectStatus, sendContract } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { Property, Prospect } from "@/types/types";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface ProspectData {
  prospect: Prospect;
  properties: Property[];
}

const PreviewSignedPdf = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [aoaPdfData, setAoaPdfData] = useState<Uint8Array | null>(null);
  const [contractPdfData, setContractPdfData] = useState<Uint8Array | null>(
    null
  );
  const [clientData, setClientData] = useState<ProspectData | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const convertBase64ToUint8Array = (base64String: string): Uint8Array => {
    const base64WithoutPrefix = base64String.split(";base64,").pop() || "";
    const byteCharacters = atob(base64WithoutPrefix);
    return new Uint8Array(
      Array.from(byteCharacters, (char) => char.charCodeAt(0))
    );
  };

  useEffect(() => {
    const fetchPreviewDocuments = async () => {
      try {
        const response = await getPreviewDocuments({ prospectId: Number(id) });
        if (response?.aoaPdf)
          setAoaPdfData(convertBase64ToUint8Array(response.aoaPdf));
        if (response?.contractPdf)
          setContractPdfData(convertBase64ToUint8Array(response.contractPdf));
      } catch (error) {
        console.error("Error fetching contract preview data:", error);
      }
    };

    const fetchClientData = async () => {
      try {
        if (id) setClientData(await getSingleProspect({ prospectId: id }));
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    if (id) {
      fetchPreviewDocuments();
      fetchClientData();
    }
  }, [id]);

  if (!clientData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-transparent">
        <LoaderCircle className="w-8 h-8 animate-spin mb-4" />
        <p>Loading client data...</p>
      </div>
    );
  }

  const handleSendContract = async (id: number) => {
    setIsSending(true);
    try {
      await sendContract({ prospectId: id });
      toast({
        title: "Contract Sent Successfully",
        description: `Contract sent to ID: ${id}`,
      });
      setClientData((prevData) =>
        prevData
          ? {
              ...prevData,
              prospect: { ...prevData.prospect, status: "IN_PROGRESS" },
            }
          : prevData
      );
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

  return (
    <div className="p-4 bg-transparent">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Preview Contract PDFs</h1>
        <Button
          variant="blue"
          onClick={() => handleSendContract(clientData.prospect.id)}
        >
          {clientData.prospect.status === "IN_PROGRESS" ? (
            "Sent"
          ) : isSending ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="animate-spin w-5 h-5" /> Sending...
            </span>
          ) : (
            "Send Contract"
          )}
        </Button>
      </div>

      <div className="flex flex-col gap-4 bg-transparent">
        {[
          { title: "AOA Form", data: aoaPdfData },
          { title: "Contract Form", data: contractPdfData },
        ].map(({ title, data }, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-transparent border border-gray-300"
          >
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            {data ? (
              <iframe
                title={title}
                src={`data:application/pdf;base64,${uint8ArrayToBase64(data)}#toolbar=0&navpanes=0`}
                className="w-full h-[75vh] min-h-[400px] rounded border bg-white"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <LoaderCircle className="w-6 h-6 animate-spin mb-2" />
                <p>Loading {title}...</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewSignedPdf;
