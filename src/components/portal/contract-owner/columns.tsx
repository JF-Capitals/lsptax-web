"use client";
import { ColumnDef } from "@tanstack/react-table";

export type ContractOwner = {
  name: string;
  email: string;
  phone: string;
  percent: string;
};

// Main columns definition
export const contractOwnerColumns: ColumnDef<ContractOwner>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "percent",
    header: "Percent",
  },
  // {
  //   header: "Actions",
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const client = row.original;

  //     const [activeModal, setActiveModal] = useState<string | null>(null);

  //     return (
  //       <>
  //         <TooltipProvider>
  //           <div className="flex gap-2">
  //             {/* Edit Button */}
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <Button
  //                   size="icon"
  //                   variant="ghost"
  //                   onClick={() => setActiveModal("edit")}
  //                 >
  //                   <FilePenLine />
  //                 </Button>
  //               </TooltipTrigger>
  //               <TooltipContent>Edit</TooltipContent>
  //             </Tooltip>

  //             {/* Add Button */}
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <Button
  //                   size="icon"
  //                   variant="ghost"
  //                   onClick={() => setActiveModal("subcontract")}
  //                 >
  //                   <Plus />
  //                 </Button>
  //               </TooltipTrigger>
  //               <TooltipContent>Sub Contract Owner</TooltipContent>
  //             </Tooltip>

  //             {/* Archive Button */}
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <Button
  //                   size="icon"
  //                   variant="ghost"
  //                   onClick={() => setActiveModal("archive")}
  //                 >
  //                   <Archive />
  //                 </Button>
  //               </TooltipTrigger>
  //               <TooltipContent>Archive Client</TooltipContent>
  //             </Tooltip>
  //           </div>
  //         </TooltipProvider>

  //         {/* <ArchiveModal
  //           isOpen={activeModal === "archive"}
  //           onClose={() => setActiveModal(null)}
  //           title="Are you sure?"
  //           description="this will archive the contract owner"
  //         /> */}
  //         <EditModal
  //           isOpen={activeModal === "edit"}
  //           setIsOpen={() => setActiveModal(null)}
  //           client={client}
  //         />
  //         <SubContractModal
  //           isOpen={activeModal === "subcontract"}
  //           setIsOpen={() => setActiveModal(null)}
  //         />
  //       </>
  //     );
  //   },
  // },
];
