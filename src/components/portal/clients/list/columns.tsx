"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { NavLink } from "react-router-dom";
import { deleteClient } from "@/api/api";
import { toast } from "sonner";

export type Clients = {
  clientId: string;
  clientNumber: string;
  clientName: string;
  email: string;
  type: string;
  mobile: string;
};

export const clientsColumn: ColumnDef<Clients>[] = [
  {
    accessorKey: "clientId",
    header: "Client #",
    cell: ({ row }) => {
      // const id = row.original.clientId;
      const clientNum = row.original.clientNumber;

      return (
        <NavLink to={`/portal/client?clientId=${clientNum}`}>
          <div className="text-blue-400 font-bold">#{clientNum}</div>
        </NavLink>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
    enableColumnFilter: true,
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
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const id = row.original.clientNumber;
      const clientName = row.original.clientName;

      const handleDelete = async () => {
        try {
          await deleteClient(Number(id));
          toast.success("Client deleted successfully");
        } catch (error) {
          toast.error("Failed to delete client");
        }
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 size={8}/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Client</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete client {clientName} (#{id}) and all
                associated properties and invoices. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
