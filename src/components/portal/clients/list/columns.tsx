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

export type Clients = {
  clientId: string;
  clientName: string;
  email: string;
  mobile: string;
};

export const clientsColumn: ColumnDef<Clients>[] = [
  {
    accessorKey: "clientId",
    header: "Client #",
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex align-center items-center justify-center"
              >
                {/* <MoreHorizontal className="h-4 w-4" /> */}
                <span className="text-blue-400">View More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-300">
              <DropdownMenuItem onClick={() => console.log({ client })}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Add Properties</DropdownMenuItem>
              <DropdownMenuItem>Show Properties</DropdownMenuItem>
              <DropdownMenuItem>Delete Client</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
