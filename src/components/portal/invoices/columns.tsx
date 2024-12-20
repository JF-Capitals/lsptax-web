"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Archive, Copy, Send } from "lucide-react";
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
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Account #:
            </h1>
            <span className="text-wrap w-8">{details.account}</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              CAD Owner:
            </h1>
            {details.cadOwners}
          </div>
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
        <TooltipProvider>
          <div className="flex">
            {/* Edit Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Invoice</TooltipContent>
            </Tooltip>

            {/* Add Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Send />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send Reminder</TooltipContent>
            </Tooltip>

            {/* Archive Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Archive />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Archive Invoice</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
];
