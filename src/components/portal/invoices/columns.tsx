"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InvoiceSummary } from "@/types/types";
import formatDate from "@/utils/formatDate";
import { NavLink } from "react-router-dom";

// export type Property = {
//   account: string;
//   cadOwners: string;
// };

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
            {row.original.propertyNumbers.map((property,index) => (
              <h1 key={index} className="bg-green-200 p-1 m-1 text-green-800 font-bold w-max border rounded-xl">
                {property}
              </h1>
            ))}
          </div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "type",
  //   header: "Type",
  // },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.totalContingencyFeeDue;
      return <div className="font-bold">${amount}</div>;
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  // cell: ({ row }) => {
  //   const status = (row.original).status;
  //   const statusLabel = status === "1" ? "Pending" : "Completed";
  //   const statusColor = status === "1" ? "text-red-500" : "text-green-500";

  //   return <span className={statusColor}>{statusLabel}</span>;
  // },
  // },
  {
    accessorKey: "addedOn",
    header: "Added/Sent On",
    cell: ({ row }) => {
      const addedOn = row.original.createdAt;
      return <div>{formatDate(addedOn)}</div>;
    },
  },
];
