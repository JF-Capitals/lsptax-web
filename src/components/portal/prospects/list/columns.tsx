"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Prospects = {
  id: string;
  prospectName: string;
  email: string;
  mobile: string;
};

export const prospectColumn: ColumnDef<Prospects>[] = [
  {
    accessorKey: "id",
    header: "Prospect #",
  },
  {
    accessorKey: "prospectName",
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
];
