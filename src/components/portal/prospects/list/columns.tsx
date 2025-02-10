"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, UserRoundPlus } from "lucide-react";
import { deleteProspect } from "@/api/api";
import { useToast } from "@/hooks/use-toast";

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


export type Prospects = {
  id: string;
  name: string;
  email: string;
  mobile: string;
};


export const prospectColumn: ColumnDef<Prospects>[] = [
  {
    accessorKey: "id",
    header: "Prospect #",
  },
  {
    accessorKey: "name",
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
      const prospect = row.original;
      const { toast } = useToast();
  
      const handleDelete = async () => {
        try {
          await deleteProspect(Number(prospect.id));
          toast({
            title: "Prospect deleted successfully",
            description: "The prospect has been removed from the system",
          });
          window.location.reload();
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to delete prospect",
            description: "Please try again",
          });
        }
      };

      // const handleMove = async () => {
      //   try {
      //     await moveProspectToClient(Number(prospect.id));
      //     toast({
      //       title: "Prospect converted successfully",
      //       description: "The prospect has been moved to clients",
      //     });
      //     window.location.reload();
      //   } catch (error) {
      //     toast({
      //       variant: "destructive",
      //       title: "Failed to convert prospect",
      //       description: "Please try again",
      //     });
      //   }
      // };

      return (
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Prospect</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete prospect {prospect.name}? This
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
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="icon">
                <UserRoundPlus className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Move to Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Convert {prospect.name} to a client? This will move all
                  prospect information to a new client record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <NavLink to={`/portal/move_to_client?prospectId=${prospect.id}`}>
                  Convert to Client
                  </NavLink>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
