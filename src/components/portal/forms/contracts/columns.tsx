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
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "propertyAccNumber",
    header: "Property Account Number",
  },
  {
    accessorKey: "generatedOn",
    header: "Generated On",
  },
  {
    accessorKey: "signedOn",
    header: "Signed On",
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
