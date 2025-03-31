"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InvoiceSummary } from "@/types/types";
import formatDate from "@/utils/formatDate";
import { NavLink } from "react-router-dom";
import { archiveItem } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";

export const invoicesColumn: ColumnDef<InvoiceSummary>[] = [
  {
    accessorKey: "id",
    header: "Invoice #",
    cell: ({ row }) => {
      const id = row.original.clientId;
      return (
        <NavLink to={`/portal/invoice?clientId=${id}`}>
          <div className="text-blue-400 font-bold">#{id}</div>
        </NavLink>
      );
    },
  },
  {
    accessorKey: "property",
    header: "Property Account Number",
    cell: ({ row }) => {
      return (
        <div>
          <div className="flex flex-wrap">
            {row.original?.propertyNumbers?.map((property, index) => (
              <h1
                key={index}
                className="bg-green-200 p-1 m-1 text-green-800 font-bold w-max border rounded-xl"
              >
                {property}
              </h1>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.totalContingencyFeeDue;
      return <div className="font-bold">${amount}</div>;
    },
  },
  {
    accessorKey: "addedOn",
    header: "Added/Sent On",
    cell: ({ row }) => {
      const addedOn = row.original.createdAt;
      return <div>{formatDate(addedOn)}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const id = row.original.id;
      const isArchived = row.original.isArchived; // Assuming `isArchived` is part of the invoice data

      // const handleDelete = async () => {
      //   try {
      //     // Replace with your delete API call
      //     await archiveItem("invoice", id); // Simulate delete for now
      //     toast({
      //       title: "✓ Invoice deleted successfully",
      //       description: "The invoice has been deleted from the system.",
      //     });
      //   } catch (error) {
      //     toast({
      //       variant: "destructive",
      //       title: "Failed to delete the invoice",
      //       description: "An unexpected error occurred. Please try again.",
      //     });
      //   }
      // };

      const handleArchive = async () => {
        try {
          await archiveItem("invoice", id);
          toast({
            title: "✓ Invoice archived successfully",
            description: "The invoice has been archived.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to archive the invoice",
            description: "An unexpected error occurred. Please try again.",
          });
        }
      };

      const handleMoveToActive = async () => {
        try {
          await archiveItem("invoice", id); // Assuming the same API can unarchive by toggling `isArchived`
          toast({
            title: "✓ Invoice moved to active successfully",
            description: "The invoice is now active.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to move the invoice to active",
            description: "An unexpected error occurred. Please try again.",
          });
        }
      };

      return (
        <div className="flex gap-2">
          {!isArchived ? (
            // Show Archive Button if the invoice is not archived
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Archive size={8} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Invoice</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive this invoice (#{id})? This
                    action can be undone by restoring the invoice later.
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
            // Show Move to Active and Delete Buttons if the invoice is archived
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Move to Active
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Move Invoice to Active</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to move this invoice (#{id}) to
                      active?
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
              {/* <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 size={8} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this invoice (#{id}). This
                      action cannot be undone.
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
              </AlertDialog> */}
            </>
          )}
        </div>
      );
    },
  },
];
