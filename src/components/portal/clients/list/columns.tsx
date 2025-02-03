"use client";

import { ColumnDef } from "@tanstack/react-table";

import { NavLink } from "react-router-dom";

export type Clients = {
  clientId: string;
  clientNumber: string;
  clientName: string;
  email: string;
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

];
