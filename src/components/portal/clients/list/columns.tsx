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
import { useToast } from "@/hooks/use-toast";
import { archiveItem } from "@/api/api"; // Import the archive function
import { Archive } from "lucide-react";

export type Clients = {
  isArchived: boolean;
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
      const clientNum = row.original.clientNumber;
      const clientId = row.original.clientId

      return (
        <NavLink to={`/portal/client?clientId=${clientNum}`}>
          <div className="text-blue-400 font-bold">#{clientId}</div>
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
      const { toast } = useToast();
      const id = row.original.clientNumber;
      const clientName = row.original.clientName;
      const isArchived = row.original.isArchived; // Assuming `isArchived` is part of the client data

      const handleDelete = async () => {
        try {
          await deleteClient(Number(id));
          toast({
            title: "✓ Client deleted successfully",
            description: "The client has been deleted from the system.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to delete the client",
            description: "An unexpected error occurred. Please try again.",
          });
        }
      };

      const handleArchive = async () => {
        try {
          await archiveItem("client", Number(id));
          toast({
            title: "✓ Client archived successfully",
            description: "The client has been archived.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to archive the client",
            description: "An unexpected error occurred. Please try again.",
          });
        }
      };

      const handleMoveToActive = async () => {
        try {
          await archiveItem("client", Number(id)); // Assuming the same API can unarchive by toggling `isArchived`
          toast({
            title: "✓ Client moved to active successfully",
            description: "The client is now active.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to move the client to active",
            description: "An unexpected error occurred. Please try again.",
          });
        }
      };

      return (
        <div className="flex gap-2">
          {!isArchived ? (
            // Show Archive Button if the client is not archived
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Archive size={8} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Client</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive client {clientName} (#{id}
                    )? This action can be undone by restoring the client later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleArchive}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            // Show Move to Active and Delete Buttons if the client is archived
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Move to Active
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Move Client to Active</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to move client {clientName} (#{id})
                      to active?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleMoveToActive}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Move to Active
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 size={8} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Client</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete client {clientName} (#{id})
                      and all associated properties and invoices. This action
                      cannot be undone.
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
            </>
          )}
        </div>
      );
    },
  },
];
