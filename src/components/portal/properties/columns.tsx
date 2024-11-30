"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PropertyDetails = {
  type: string;
  class: string;
  assessor: string;
  address: string;
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
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
          <div>Type: {details.type}</div>
          <div>Class: {details.class}</div>
          <div>Assessor: {details.assessor}</div>
          <div>Address: {details.address}</div>
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
        <div>
          <div>Name: {owner.name}</div>
          <div>Address: {owner.address}</div>
          <div>Mailing Address: {owner.mailingAddress}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "hearingDate",
    header: "Hearing Date",
  },
  {
    accessorKey: "aoaSigned",
    header: "AOA Signed",
  },
  {
    accessorKey: "addedOn",
    header: "Added On",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-300">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log({ client })}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Add Properties</DropdownMenuItem>
            <DropdownMenuItem>Show Properties</DropdownMenuItem>
            <DropdownMenuItem>Delete Client</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
