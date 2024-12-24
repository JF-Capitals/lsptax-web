"use client";

import { ColumnDef } from "@tanstack/react-table";
export type Clients = {
  clientId: string;
  clientName: string;
  email: string;
  mobile: string;
};

export const clientsColumn: ColumnDef<Clients>[] = [
  {
    accessorKey: "clientId",
    header: "Client #",
    cell: ({ row }) => {
      const id = row.original.clientId;
      return <div className="text-blue-400 font-bold">#{id}</div>;
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
];
