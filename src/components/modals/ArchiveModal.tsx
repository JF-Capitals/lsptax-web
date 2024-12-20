// ArchiveModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ArchiveModal = ({
  isOpen,
  onClose,
  title,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onClose}>
            Archive
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArchiveModal;
