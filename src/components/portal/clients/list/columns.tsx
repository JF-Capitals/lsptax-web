"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Archive, FilePenLine, House, Plus } from "lucide-react";

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
        <TooltipProvider>
          <div className="flex gap-2 border">
            {/* Edit Button */}
            <Tooltip>
              <TooltipTrigger asChild>  
                <Button size="icon" variant="ghost">
                  <FilePenLine />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Client</TooltipContent>
            </Tooltip>

            {/* Add Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Property</TooltipContent>
            </Tooltip>

            {/* House Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <House />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List Property</TooltipContent>
            </Tooltip>

            {/* Archive Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Archive />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive Client</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
];
