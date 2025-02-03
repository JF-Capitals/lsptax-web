"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, UserRoundPlus } from "lucide-react";

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
      console.log(prospect);

      return (
        <div className="flex gap-2 ">
          <Button variant={"blue"}>
            <Trash2 />
          </Button>
          <Button variant={"blue"}>
            <UserRoundPlus />
          </Button>
        </div>
      );
    },
  },
];
