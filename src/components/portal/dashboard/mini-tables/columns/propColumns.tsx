"use client";

import { ColumnDef } from "@tanstack/react-table";
import formatDate from "@/utils/formatDate";

export type PropertyDetails = {
  type: string;
  class: string;
  assessor: string;
  address: string[];
};

export type CADOwner = {
  name: string;
  address: string;
  mailingAddress: string;
};

export type Properties = {
  propertyId: string;
  clientId: string;
  propertyAccount: string;
  propertyDetails: PropertyDetails;
  cadOwner: CADOwner;
  hearingDate: string;
  aoaSigned: string;
  addedOn: string;
  status: number;
};

export const propertiesColumn: ColumnDef<Properties>[] = [
  {
    accessorKey: "clientId",
    header: "Client #",
    cell: ({ row }) => {
      const id = row.original.clientId;
      return <div className="text-blue-400 font-bold">#{id}</div>;
    },
  },
  {
    accessorKey: "propertyAccount",
    header: "Property Account#",
    cell: ({ row }) => {
      const id = row.original.propertyAccount;
      return <div className="text-green-500 font-bold">#{id}</div>;
    },
  },
  {
    accessorKey: "cadOwner",
    header: "CAD Owner",
    cell: ({ row }) => {
      const owner = row.original.cadOwner;
      return <div className="">{owner.name}</div>;
    },
  },
  {
    accessorKey: "aoaSigned",
    header: "AOA Signed",
    cell: ({ row }) => {
      const aoaSigned = row.original.aoaSigned;
      return <div>{formatDate(aoaSigned)}</div>;
    },
  },
  // {
  //   accessorKey: "addedOn",
  //   header: "Added On",
  //   cell: ({ row }) => {
  //     const addedOn = row.original.addedOn;
  //     return <div>{formatDate(addedOn)}</div>;
  //   },
  // },
];
