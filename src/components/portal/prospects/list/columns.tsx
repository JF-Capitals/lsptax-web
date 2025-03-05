"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, UserRoundPlus } from "lucide-react";
import { changeProspectStatus, deleteProspect } from "@/api/api";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup components
import { Label } from "@/components/ui/label"; // Import Label for RadioGroup items
import React from "react";

export type Prospects = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: string;
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
    header: "Status",
    id: "status",
    cell: ({ row }) => {
      const prospect = row.original;
      const { toast } = useToast();
      const [selectedStatus, setSelectedStatus] = React.useState(
        prospect.status
      );

      const handleStatusChange = async (newStatus: string) => {
        try {
          await changeProspectStatus({
            prospectId: parseInt(prospect.id),
            newStatus,
          });
          toast({
            title: "Status updated successfully",
            description: `Prospect status changed to ${newStatus}`,
          });
          window.location.reload();
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to update status",
            description: "Please try again",
          });
        }
      };

      // Define status colors
      const statusColors = {
        NOT_CONTACTED: "bg-red-100 text-red-800 hover:bg-red-200", // Light red
        CONTACTED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", // Light yellow
        IN_PROGRESS: "bg-green-100 text-green-800 hover:bg-green-200", // Light green
      };

      return (
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={
                  statusColors[prospect.status as keyof typeof statusColors] ||
                  "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }
              >
                {prospect.status || "Set Status"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Select the Current Status</AlertDialogTitle>
                <AlertDialogDescription>
                  <RadioGroup
                    defaultValue={prospect.status}
                    onValueChange={(value) => setSelectedStatus(value)}
                    className="mt-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="NOT_CONTACTED"
                        id="not_contacted"
                      />
                      <Label htmlFor="not_contacted">Not Contacted</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CONTACTED" id="contacted" />
                      <Label htmlFor="contacted">Contacted</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="IN_PROGRESS" id="in-progress" />
                      <Label htmlFor="in-progress">In Progress</Label>
                    </div>
                  </RadioGroup>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusChange(selectedStatus)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Status
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
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
                  <NavLink
                    to={`/portal/move_to_client?prospectId=${prospect.id}`}
                  >
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
