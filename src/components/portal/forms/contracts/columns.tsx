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
import formatDate from "@/utils/formatDate";

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
      const client = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
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
