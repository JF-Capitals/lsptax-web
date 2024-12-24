"use client";

import { ColumnDef } from "@tanstack/react-table";

export type PropertyYearData = {
  ls_lpd_id: number;
  ls_lpd_prop_id: number;
  ls_lpd_year: number;
  ls_lpd_fieldname: string;
  ls_lpd_fieldvalue: string;
  ls_lpd_status: string;
};

export const propertyYearDataColumn: ColumnDef<PropertyYearData>[] = [
  {
    accessorKey: "ls_lpd_fieldname",
    header: "Field Name",
  },
  {
    accessorKey: "ls_lpd_year",
    header: "Property Account#",
  },
];
