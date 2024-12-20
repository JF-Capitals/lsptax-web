"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Archive, FilePenLine, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import ArchiveModal from "@/components/modals/ArchiveModal";

export type ContractOwner = {
  name: string;
  email: string;
  phone: string;
  percent: string;
};

const EditModal = ({
  isOpen,
  setIsOpen,
  client,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  client: ContractOwner;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contract Owner</DialogTitle>
          <DialogDescription>
            Modify the details of the contract owner.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            defaultValue={client.name}
            className="block w-full rounded-md border-gray-300 p-2"
          />
          <input
            type="email"
            placeholder="Email"
            defaultValue={client.email}
            className="block w-full rounded-md border-gray-300 p-2"
          />
          <input
            type="tel"
            placeholder="Phone"
            defaultValue={client.phone}
            className="block w-full rounded-md border-gray-300 p-2"
          />
          <input
            type="text"
            placeholder="Percent"
            defaultValue={client.percent}
            className="block w-full rounded-md border-gray-300 p-2"
          />
          <div className="flex justify-end">
            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SubContractModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sub-contract Owner</DialogTitle>
          <DialogDescription>
            Add a new sub-contract owner for this contract.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Sub-contract Owner Name"
            className="block w-full rounded-md border-gray-300 p-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="block w-full rounded-md border-gray-300 p-2"
          />
          <div className="flex justify-end">
            <Button type="submit" className="mt-4">
              Add Sub-contract Owner
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main columns definition
export const contractOwnerColumns: ColumnDef<ContractOwner>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "percent",
    header: "Percent",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      const [activeModal, setActiveModal] = useState<string | null>(null);

      return (
        <>
          <TooltipProvider>
            <div className="flex gap-2">
              {/* Edit Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setActiveModal("edit")}
                  >
                    <FilePenLine />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              {/* Add Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setActiveModal("subcontract")}
                  >
                    <Plus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sub Contract Owner</TooltipContent>
              </Tooltip>

              {/* Archive Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setActiveModal("archive")}
                  >
                    <Archive />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Archive Client</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <ArchiveModal
            isOpen={activeModal === "archive"}
            onClose={() => setActiveModal(null)}
            title="Are you sure?"
            description="this will archive the contract owner"
          />
          <EditModal
            isOpen={activeModal === "edit"}
            setIsOpen={() => setActiveModal(null)}
            client={client}
          />
          <SubContractModal
            isOpen={activeModal === "subcontract"}
            setIsOpen={() => setActiveModal(null)}
          />
        </>
      );
    },
  },
];
