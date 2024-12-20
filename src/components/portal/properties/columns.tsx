"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatDate from "@/utils/formatDate";
import { Archive, Eye, File, FilePenLine } from "lucide-react";
import ViewModal from "@/components/modals/ViewModal";
import ArchiveModal from "@/components/modals/ArchiveModal";
import { useState } from "react";
import { getSingleProperty } from "@/store/data"; // Import the new function for fetching a single property

export type PropertyDetails = {
  type: string;
  class: string;
  assessor: string;
  address: string[];
};

export type CADOwner = {
  name: string;
  address: string;
  mailingAddress: string;
};

export type Properties = {
  clientId: string;
  propertyAccount: string;
  propertyDetails: PropertyDetails;
  cadOwner: CADOwner;
  hearingDate: string;
  aoaSigned: string;
  addedOn: string;
};

export const propertiesColumn: ColumnDef<Properties>[] = [
  {
    accessorKey: "clientId",
    header: "Client #",
  },
  {
    accessorKey: "propertyAccount",
    header: "Property Account#",
  },
  {
    accessorKey: "propertyDetails",
    header: "Property Details",
    cell: ({ row }) => {
      const details = row.original.propertyDetails;
      return (
        <div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">Type:</h1>
            {details.type}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">Class:</h1>{" "}
            {details.class ? details.class : "N/A"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Assessor:
            </h1>
            {details.assessor ? details.assessor : "N/A"}
          </div>{" "}
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Address:
            </h1>
            {details.address ? details.address.join(", ") : "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "cadOwner",
    header: "CAD Owner",
    cell: ({ row }) => {
      const owner = row.original.cadOwner;
      return (
        <div className="">
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">Name:</h1>
            {owner.name}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Address:
            </h1>{" "}
            {owner.address ? owner.address : "N/A"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Mailing Address:
            </h1>
            {owner.mailingAddress ? owner.mailingAddress : "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hearingDate",
    header: "Hearing Date",
    cell: ({ row }) => {
      const hearingDate = row.original.hearingDate;
      return <div className="">{formatDate(hearingDate)}</div>;
    },
  },
  {
    accessorKey: "aoaSigned",
    header: "AOA Signed",
    cell: ({ row }) => {
      const aoaSigned = row.original.aoaSigned;
      return <div>{formatDate(aoaSigned)}</div>;
    },
  },
  {
    accessorKey: "addedOn",
    header: "Added On",
    cell: ({ row }) => {
      const addedOn = row.original.addedOn;
      return <div>{formatDate(addedOn)}</div>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const propertyId = parseInt( row.original.propertyAccount); // Assuming propertyAccount is the unique identifier
      const [activeModal, setActiveModal] = useState<string | null>(null);
      const [propertyDetails, setPropertyDetails] = useState<Properties | null>(
        null
      );

      const handleViewProperty = async () => {
        const data = await getSingleProperty({ propertyId });
        setPropertyDetails(data[0]); // Assuming the response is an array, take the first item
        setActiveModal("view");
      };

      return (
        <>
          <TooltipProvider>
            <div className="flex">
              {/* Edit Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <FilePenLine />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Property</TooltipContent>
              </Tooltip>

              {/* View Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleViewProperty}
                  >
                    <Eye />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Property</TooltipContent>
              </Tooltip>

              {/* House Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <File />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Invoices</TooltipContent>
              </Tooltip>

              {/* Archive Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Archive />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Archive Property</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Modals */}
          <ViewModal
            isOpen={activeModal === "view"}
            onClose={() => setActiveModal(null)}
            data={propertyDetails} // Pass the fetched property details to the modal
            renderData={(data) => {
              // Render property details inside the modal
              return (
                <div>
                  <div className="flex flex-col">
                    <h1 className="text-xs font-bold text-muted-foreground">
                      Type:
                    </h1>
                    {data?.propertyDetails.type}
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xs font-bold text-muted-foreground">
                      Class:
                    </h1>{" "}
                    {data?.propertyDetails.class || "N/A"}
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xs font-bold text-muted-foreground">
                      Assessor:
                    </h1>
                    {data?.propertyDetails.assessor || "N/A"}
                  </div>{" "}
                  <div className="flex flex-col">
                    <h1 className="text-xs font-bold text-muted-foreground">
                      Address:
                    </h1>
                    {data?.propertyDetails.address?.join(", ") || "N/A"}
                  </div>
                </div>
              );
            }}
          />
          <ArchiveModal
            isOpen={activeModal === "archive"}
            onClose={() => setActiveModal(null)}
            title="Are you sure?"
            description="This will archive the property"
          />
        </>
      );
    },
  },
];
