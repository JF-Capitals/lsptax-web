"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Send,
} from "lucide-react";
import formatDate from "@/utils/formatDate";
import { useState } from "react";
import ArchiveModal from "@/components/modals/ArchiveModal";
import ViewModal from "@/components/modals/ViewModal";

export type Owner = {
  name: string;
  phone: string;
  address: string;
};

export type Contract = {
  owner: string;
  propertyAccNumber: string[];
  generatedOn: string;
  signedOn: string;
};

export const contractsColumn: ColumnDef<Contract>[] = [
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "propertyAccNumber",
    header: "Property Account Number",
    cell: ({ row }) => {
      const propertyAccNumber = row.original.propertyAccNumber;
      return (
        <div className="flex flex-wrap ">
          {propertyAccNumber.map((accNum) => (
            <h2 className="text-green-600 font-bold text-xs bg-green-100 m-1 w-max p-1 rounded">
              #{accNum}
            </h2>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "generatedOn",
    header: "Generated On",
    cell: ({ row }) => {
      const generatedOn = row.original.generatedOn;
      return <div>{formatDate(generatedOn)}</div>;
    },
  },
  {
    accessorKey: "signedOn",
    header: "Signed On",
    cell: ({ row }) => {
      const signedOn = row.original.signedOn;
      return <div>{formatDate(signedOn)}</div>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const contract = row.original;
      const [activeModal, setActiveModal] = useState<string | null>(null);
       const renderContractData = (data: Contract) => {
         return (
           <>
             <div>
               <strong>Owner:</strong> {data.owner}
             </div>
             <div>
               <strong>Property Account Numbers:</strong>
               <div className="flex flex-wrap">
                 {data.propertyAccNumber.map((accNum, index) => (
                   <span
                     key={index}
                     className="text-green-600 font-bold text-xs bg-green-100 m-1 p-1 rounded"
                   >
                     #{accNum}
                   </span>
                 ))}
               </div>
             </div>
             <div>
               <strong>Generated On:</strong> {formatDate(data.generatedOn)}
             </div>
             <div>
               <strong>Signed On:</strong> {formatDate(data.signedOn)}
             </div>
           </>
         );
       };

      return (
        <>
          <TooltipProvider>
            <div className="flex gap-2 border">
              {/* View Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setActiveModal("view")}
                  >
                    <Eye />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>

              {/* Send Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setActiveModal("send")}
                  >
                    <Send />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send Email</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <ViewModal
            isOpen={activeModal === "view"}
            onClose={() => setActiveModal(null)}
            data={contract}
            renderData={renderContractData} // Pass the render function for the contract
          />
          <ArchiveModal
            isOpen={activeModal === "archive"}
            onClose={() => setActiveModal(null)}
            title="Are you sure?"
            description="this will archive the contract"
          />
        </>
      );
    },
  },
];
