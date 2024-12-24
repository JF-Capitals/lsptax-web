"use client";

import { ColumnDef } from "@tanstack/react-table";
import formatDate from "@/utils/formatDate";
import { NavLink } from "react-router-dom";

export type Owner = {
  name: string;
  phone: string;
  address: string;
};

export type Contract = {
  owner: string;
  propertyAccNumber: string[];
  generatedOn: string;
  signedOn: string;
};

export const contractsColumn: ColumnDef<Contract>[] = [
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const id = row.original.owner;
      return (<NavLink to={`/portal/contract-form`}>
        <div>{ id}</div>
      </NavLink>)
    }
  },
  {
    accessorKey: "propertyAccNumber",
    header: "Property Account Number",
    cell: ({ row }) => {
      const propertyAccNumber = row.original.propertyAccNumber;
      return (
        <div className="flex flex-wrap ">
          {propertyAccNumber.map((accNum) => (
            <h2 className="text-green-600 font-bold text-xs bg-green-100 m-1 w-max p-1 rounded">
              #{accNum}
            </h2>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "generatedOn",
    header: "Generated On",
    cell: ({ row }) => {
      const generatedOn = row.original.generatedOn;
      return <div>{formatDate(generatedOn)}</div>;
    },
  },
  {
    accessorKey: "signedOn",
    header: "Signed On",
    cell: ({ row }) => {
      const signedOn = row.original.signedOn;
      return <div>{formatDate(signedOn)}</div>;
    },
  },
];
