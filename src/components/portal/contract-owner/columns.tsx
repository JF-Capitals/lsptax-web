"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ContractOwner = {
  name: string;
  email: string;
  phone: string;
  percent: string;
};

export const contractOwnerColumns: ColumnDef<ContractOwner>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "email",
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
