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

export type Property = {
    account: string;
    cadOwners: string;
}

export type Invoices = {
  id: string;
  type: string;
  property: Property;
  amount: string;
  status: string;
  addedOn: string;
  reminders: string[];
};

export const invoicesColumn: ColumnDef<Invoices>[] = [
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
    accessorKey: "id",
    header: "Invoice #",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => {
      const details = row.original.property;
      return (
        <div>
          <div>Account #: {details.account}</div>
          <div>CAD Owner: {details.cadOwners}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "addedOn",
    header: "Added/Sent On",
  },
  {
    accessorKey: "reminders",
    header: "Reminders",
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
