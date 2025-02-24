"use client";

import { ColumnDef } from "@tanstack/react-table";
import formatDate from "@/utils/formatDate";

import { NavLink } from "react-router-dom";

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
  propertyId: number;
  clientId: string;
  propertyAccount: string;
  propertyDetails: PropertyDetails;
  cadOwner: CADOwner;
  hearingDate: string;
  aoaSigned: string;
  addedOn: string;
  status: number; // 1 = active, 0 = archived
};

export const propertiesColumn: ColumnDef<Properties>[] = [
  {
    accessorKey: "clientId",
    header: "Client #",
    cell: ({ row }) => {
      // const id = row.original.clientId;
      const clientNum = row.original.clientId;

      return <div className="text-blue-400 font-bold">#{clientNum}</div>;
    },
  },
  {
    accessorKey: "propertyAccount",
    header: "Property Account#",
    cell: ({ row }) => {
      // const id = row.original.clientId;
      const propertyAccount = row.original.propertyAccount;

      return (
        <NavLink
          to={`/portal/property?propertyId=${row.original.propertyId}`}
        >
          <div className="text-green-400 font-bold">#{propertyAccount}</div>
        </NavLink>
      );
    },
  },
  {
    accessorKey: "propertyDetails",
    header: "Property Details",
    cell: ({ row }) => {
      const details = row.original.propertyDetails;
      return (
        <div className=" gap-4">
          {/* <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">Type:</h1>
            {details.type}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">Class:</h1>{" "}
            {details.class ? details.class : "N/A"}
          </div> */}
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Assessor:
            </h1>
            {details.assessor ? details.assessor : "N/A"}
          </div>{" "}
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Address:
            </h1>
            {details.address ? details.address.join(", ") : "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "cadOwner",
    header: "CAD Owner",
    cell: ({ row }) => {
      const owner = row.original.cadOwner;
      return (
        <div className="">
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">Name:</h1>
            {owner.name}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Address:
            </h1>{" "}
            {owner.address ? owner.address : "N/A"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-bold text-muted-foreground">
              Mailing Address:
            </h1>
            {owner.mailingAddress ? owner.mailingAddress : "N/A"}
          </div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "hearingDate",
  //   header: "Hearing Date",
  //   cell: ({ row }) => {
  //     const hearingDate = row.original.hearingDate;
  //     return <div className="">{(hearingDate)}</div>;
  //   },
  // },
  // {
  //   accessorKey: "aoaSigned",
  //   header: "AOA Signed",
  //   cell: ({ row }) => {
  //     const aoaSigned = row.original.aoaSigned;
  //     return <div>{(aoaSigned)}</div>;
  //   },
  // },
  {
    accessorKey: "addedOn",
    header: "Added On",
    cell: ({ row }) => {
      const addedOn = row.original.addedOn;
      return <div>{formatDate(addedOn)}</div>;
    },
  },
  // {
  //   header: "Actions",
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const propertyId = row.original.propertyId;
  //     const [activeModal, setActiveModal] = useState<string | null>(null);

  //     return (
  //       <>
  //         <TooltipProvider>
  //           <div className="flex">
  //             {/* Edit Button */}
  //             <NavLink to={`/portal/edit-properties?propertyId=${propertyId}`}>
  //               <Tooltip>
  //                 <TooltipTrigger asChild>
  //                   <Button size="icon" variant="ghost">
  //                     <FilePenLine />
  //                   </Button>
  //                 </TooltipTrigger>
  //                 <TooltipContent>Edit Property</TooltipContent>
  //               </Tooltip>
  //             </NavLink>

  //             {/* View Button */}
  //             <NavLink to={`/portal/view-properties?propertyId=${propertyId}`}>
  //               <Tooltip>
  //                 <TooltipTrigger asChild>
  //                   <Button size="icon" variant="ghost">
  //                     <Eye />
  //                   </Button>
  //                 </TooltipTrigger>
  //                 <TooltipContent>View Property</TooltipContent>
  //               </Tooltip>
  //             </NavLink>

  //             {/* House Button */}
  //             <NavLink to={`/portal/invoices?propertyId=${propertyId}`}>
  //               <Tooltip>
  //                 <TooltipTrigger asChild>
  //                   <Button size="icon" variant="ghost">
  //                     <File />
  //                   </Button>
  //                 </TooltipTrigger>
  //                 <TooltipContent>See Invoices</TooltipContent>
  //               </Tooltip>
  //             </NavLink>

  //             {/* Archive or Unarchive Button */}
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <Button
  //                   size="icon"
  //                   variant="ghost"
  //                   onClick={() =>
  //                     row.original.status === 1
  //                       ? setActiveModal("archive")
  //                       : setActiveModal("unarchive")
  //                   }
  //                 >
  //                   {row.original.status === 1 ? <Archive /> : <RefreshCcw />}
  //                 </Button>
  //               </TooltipTrigger>
  //               <TooltipContent>
  //                 {row.original.status === 1
  //                   ? "Archive Property"
  //                   : "Unarchive Property"}
  //               </TooltipContent>
  //             </Tooltip>
  //           </div>
  //         </TooltipProvider>

  //         <ArchiveModal
  //           isOpen={activeModal === "archive"}
  //           onClose={() => setActiveModal(null)}
  //           title="Are you sure?"
  //           description="This will archive the property"
  //           onAction={() => {
  //             handleArchiveUnarchive("property", propertyId, "archive");
  //             setActiveModal(null);
  //           }}
  //           actionType="Archive" // Pass the action type as "Archive"
  //         />

  //         <ArchiveModal
  //           isOpen={activeModal === "unarchive"}
  //           onClose={() => setActiveModal(null)}
  //           title="Are you sure?"
  //           description="This will unarchive the property"
  //           onAction={() => {
  //             handleArchiveUnarchive("property", propertyId, "unarchive");
  //             setActiveModal(null);
  //           }}
  //           actionType="Unarchive" // Pass the action type as "Unarchive"
  //         />
  //       </>
  //     );
  //   },
  // },
];
