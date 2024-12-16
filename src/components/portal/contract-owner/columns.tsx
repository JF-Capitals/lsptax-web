"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export type ContractOwner = {
  name: string;
  email: string;
  phone: string;
  percent: string;
};

// Modal components
const ArchiveModal = ({
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
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. It will archive the contract owner.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => setIsOpen(false)}>
            Archive
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
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
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-300">
              <DropdownMenuItem onClick={() => setActiveModal("archive")}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveModal("edit")}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveModal("subcontract")}>
                Add Sub-contract Owner
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modal components */}
          <ArchiveModal
            isOpen={activeModal === "archive"}
            setIsOpen={() => setActiveModal(null)}
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
