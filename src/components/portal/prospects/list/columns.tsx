"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Archive, BookPlus, FilePenLine, House, Plus } from "lucide-react";

export type Prospects = {
  id: string;
  prospectName: string;
  email: string;
  mobile: string;
};

export const prospectColumn: ColumnDef<Prospects>[] = [
 
  {
    accessorKey: "id",
    header: "Prospect #",
  },
  {
    accessorKey: "prospectName",
    header: "Prospect Name",
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
      console.log(client.id)

      return (
        <TooltipProvider>
          <div className="flex">
            {/* Edit Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <FilePenLine />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Prospect</TooltipContent>
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
              <TooltipContent>Archive Prospect</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <BookPlus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Move to Client</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
];
