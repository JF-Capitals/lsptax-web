import { getSingleClient } from "@/store/data";
import { ClientData, Property } from "@/types/types";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Printer, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { previewContract, sendContractForClient } from "@/api/api";

interface Client {
  client: ClientData;
  properties: Property[];
}

export default function ContractForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clientId = searchParams.get("clientId");
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [clientData, setClientData] = useState<Client>();
  const [contractPdfBase64, setContractPdfBase64] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (clientId) {
          const response = await getSingleClient({ clientId });
          setClientData(response);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    if (clientId) fetchClientData();
  }, [clientId]);

  useEffect(() => {
    if (!clientData?.client?.id) return;
    setPreviewLoading(true);
    setPreviewError(null);
    previewContract(clientData.client.id)
      .then((res) => {
        setContractPdfBase64(res.contractPdf ?? null);
      })
      .catch((err) => {
        setPreviewError(err instanceof Error ? err.message : "Failed to load preview");
      })
      .finally(() => setPreviewLoading(false));
  }, [clientData?.client?.id]);

  const hasPdf = !!contractPdfBase64 && !previewLoading;

  const handleDownloadPdf = () => {
    if (!contractPdfBase64) return;
    try {
      const blob = new Blob([Uint8Array.from(atob(contractPdfBase64), (c) => c.charCodeAt(0))], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract-client-${clientData?.client?.clientNumber ?? clientId ?? "contract"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download started",
        description: "Contract PDF has been downloaded.",
      });
    } catch {
      toast({
        title: "Download failed",
        description: "Could not save the PDF.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    if (!contractPdfBase64) return;
    const dataUrl = `data:application/pdf;base64,${contractPdfBase64}`;
    const w = window.open(dataUrl, "_blank", "noopener,noreferrer");
    if (w) {
      w.onload = () => w.print();
    } else {
      toast({
        title: "Print blocked",
        description: "Allow pop-ups to print the contract, or use Download then print the file.",
        variant: "destructive",
      });
    }
  };

  const handleSendContract = async () => {
    if (!clientData?.client?.id) {
      toast({
        title: "Error",
        description: "Client data not loaded or missing client ID.",
        variant: "destructive",
      });
      return;
    }
    setIsSending(true);
    try {
      await sendContractForClient(clientData.client.id);
      toast({
        title: "✓ Contract sent for signing",
        description: "Contract has been sent to the client. They will receive an email from DocuSign.",
      });
      navigate(`/portal/client?clientId=${clientData.client.id}`);
    } catch (error) {
      toast({
        title: "Failed to send contract",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="blue"
          className="rounded-md p-2 px-6"
          onClick={handleDownloadPdf}
          disabled={!hasPdf}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button
          variant="blue"
          className="rounded-md p-2 px-6"
          onClick={handlePrint}
          disabled={!hasPdf}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          variant="blue"
          className="rounded-md p-2 px-6"
          onClick={handleSendContract}
          disabled={isSending || !clientData?.client?.id}
        >
          {isSending ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="animate-spin h-5 w-5" />
              Sending...
            </span>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send for signing
            </>
          )}
        </Button>
      </div>

      {previewLoading && (
        <div className="flex items-center justify-center py-12 gap-2 text-gray-600">
          <LoaderCircle className="h-6 w-6 animate-spin" />
          Loading contract from server...
        </div>
      )}

      {previewError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 mb-4">
          <p className="font-medium">Preview could not be loaded</p>
          <p className="text-sm mt-1">{previewError}</p>
          <p className="text-sm mt-2">You can still send for signing once client data is ready.</p>
        </div>
      )}

      {hasPdf && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <p className="text-sm font-medium text-gray-700 p-2 border-b bg-gray-50">
            Contract (generated by server)
          </p>
          <iframe
            title="Contract preview"
            src={`data:application/pdf;base64,${contractPdfBase64}`}
            className="w-full h-[75vh] min-h-[500px]"
          />
        </div>
      )}

      {!clientId && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-600">
          <p>Open this page with a client selected (e.g. from Client details → Create Contract) to load the contract.</p>
        </div>
      )}
    </div>
  );
}
