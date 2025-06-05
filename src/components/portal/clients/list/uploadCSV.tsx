import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface UploadCsvButtonProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const UploadCsvButton = ({
  onSuccess,
  onError,
}: UploadCsvButtonProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csv", file);

    try {
      setUploading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/action/add-client-data-csv`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      onSuccess?.();
    } catch (err) {
      console.error("Upload error:", err);
      onError?.(err);
    } finally {
      setUploading(false);
      // Reset input so same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />
      <Button variant="blue" disabled={uploading} onClick={triggerFileSelect}>
        {uploading ? <LoaderCircle className="animate-spin" /> : "Upload CSV"}
      </Button>
    </>
  );
};

export default UploadCsvButton;
