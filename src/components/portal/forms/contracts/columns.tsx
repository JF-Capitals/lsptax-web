"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

export type Clients = {
  clientId: string;
  clientNumber: string;
  clientName: string;
  email: string;
  mobile: string;
};

export const contractsColumn: ColumnDef<Clients>[] = [
  {
    accessorKey: "clientId",
    header: "Client #",
    cell: ({ row }) => {
      // const id = row.original.clientId;
      const clientNum = row.original.clientNumber;

      return (
        <NavLink to={`/portal/contract?clientId=${clientNum}`}>
          <div className="text-blue-400 font-bold">#{clientNum}</div>
        </NavLink>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
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
    accessorKey: "Forms",
    // header: "Mobile",
    cell: ({ row }) => {
      // const id = row.original.clientId;
      const clientNum = row.original.clientNumber;

      return (
        <div>
          <NavLink to={`/portal/contract?clientId=${clientNum}`}>
          <Button>AOA</Button>
          </NavLink>
          <NavLink to={`/portal/agent?clietId=${clientNum}`}>
          <Button>Agent</Button>
          </NavLink>
       </div>
      );
    },
  },
];
