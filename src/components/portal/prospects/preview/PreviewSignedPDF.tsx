import { getPreviewDocuments, getSingleProspect } from "@/store/data";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { changeProspectStatus, sendContract } from "@/api/api";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useToast } from "@/hooks/use-toast";
import { Property, Prospect } from "@/types/types";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

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
  const [isSending, setIsSending] = useState(false); // Track sending state
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreviewDocuments = async () => {
      try {
        console.log("Fetching preview documents for prospectId:", id);

        const response = await getPreviewDocuments({
          prospectId: Number(id),
        });

        if (response?.aoaPdf) {
          const aoaPdf = convertBase64ToUint8Array(response.aoaPdf);
          setAoaPdfData(aoaPdf);
        } else {
          console.error("AOA PDF is missing or invalid");
        }

        if (response?.contractPdf) {
          const contractPdf = convertBase64ToUint8Array(response.contractPdf);
          setContractPdfData(contractPdf);
        } else {
          console.error("Contract PDF is missing or invalid");
        }
      } catch (error) {
        console.error("Error fetching contract preview data:", error);
      }
    };
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
      fetchPreviewDocuments();
      fetchClientData();
    } else {
      console.error("Prospect ID is missing");
    }
  }, [id]);
  if (!clientData) {
    return (
      <div className="text-center text-gray-500">Loading client data...</div>
    );
  }
  // Convert Base64 to Uint8Array for PDF.js
  const convertBase64ToUint8Array = (base64String: string): Uint8Array => {
    const base64WithoutPrefix = base64String.split(";base64,").pop() || "";
    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Uint8Array(
      Array.from(byteCharacters, (char) => char.charCodeAt(0))
    );
    return byteNumbers;
  };
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
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mb-4">Preview Contract PDFs</h1>
        <Button
          variant={"blue"}
          // className="w-full"
          onClick={() => handleSendContract(clientData.prospect.id)}
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
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">AOA Form</h2>
        {aoaPdfData ? (
          <Worker
            workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}
          >
            <Viewer
              fileUrl={URL.createObjectURL(
                new Blob([aoaPdfData], { type: "application/pdf" })
              )}
            />
          </Worker>
        ) : (
          <p>Loading AOA Form...</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Contract Form</h2>
        {contractPdfData ? (
          <Worker
            workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}
          >
            <Viewer
              fileUrl={URL.createObjectURL(
                new Blob([contractPdfData], { type: "application/pdf" })
              )}
            />
          </Worker>
        ) : (
          <p>Loading Contract Form...</p>
        )}
      </div>
    </div>
  );
};

export default PreviewSignedPdf;
