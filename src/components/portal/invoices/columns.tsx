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

export type Property = {
  account: string;
  cadOwners: string;
};

export type Invoices = {
  id: string;
  type: string;
  property: Property;
  amount: string;
  status: string;
  addedOn: string;
  reminders: string;
};

export const invoicesColumn: ColumnDef<Invoices>[] = [
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
    cell: ({ row }) => {
      const status = (row.original as Invoices).status;
      const statusLabel = status === "1" ? "Pending" : "Completed";
      const statusColor = status === "1" ? "text-red-500" : "text-green-500";

      return <span className={statusColor}>{statusLabel}</span>;
    },
  },
  {
    accessorKey: "addedOn",
    header: "Added/Sent On",
    cell: ({ row }) => {
      const addedOn = row.original.addedOn;
      return <div>{formatDate(addedOn)}</div>;
    },
  },
  {
    accessorKey: "reminders",
    header: "Reminders",
    cell: ({ row }) => {
      const reminders = row.original.reminders;

      if (!reminders) {
        return <div>N/A</div>;
      }

      // Ensure reminders are split and formatted
      const formattedReminders = reminders
        .split("|") // Split the string by "|"
        .filter((reminder) => reminder.trim() !== "") // Filter out empty entries
        .map((reminder) => formatDate(reminder)); // Use the existing formatDate function

      // Debug output
      console.log("Formatted Reminders:", formattedReminders);

      return (
        <ul>
          {formattedReminders.map((reminder, index) => (
            <li key={index}>{reminder}</li>
          ))}
        </ul>
      );
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
