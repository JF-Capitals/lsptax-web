import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getSingleProperty } from "@/store/data";
import { PropertyData } from "@/types/types";
import { editProperty } from "@/api/api";

// Table Row Type Definition
type TableRow = {
  year: number;
  "Protested Date": string;
  "BPP Rendered": string;
  "Prelim Land": string;
  "Prelim Building": string;
  "Prelim Total": string;
  "Assessed Prelim": string;
  "Final Land": string;
  "Final Building": string;
  "Final Total": string;
  "Assessed Final": string;
  "Hearing Date": string;
  "Invoice Date": string;
  "Under Litigation": boolean;
  "Under Arbitration": boolean;
  Reduction: string;
  "Tax Rate": string;
  "Taxes Saved": string;
  "Contingency Fee": string;
  "Invoice Amount": string;
  "Paid Date": string;
  "Payment Notes": string;
};

// Form Schema
const formSchema = z.object({
  StatusNotes: z.string().optional(),
  OtherNotes: z.string().optional(),
  NAMEONCAD: z.string().optional(),
  MAILINGADDRESS: z.string().optional(),
  MAILINGADDRESSCITYTXZIP: z.string().optional(),
  CADMailingADDRESS: z.string().optional(),
  CADCITY: z.string().optional(),
  CADZIPCODE: z.string().optional(),
  CADCOUNTY: z.string().optional(),
  AccountNumber: z.string().optional(),
  CLIENTNumber: z.string().optional(),
  CONTACTOWNER: z.string().optional(),
  SUBCONTRACTOWNER: z.string().optional(),
  BPPFEE: z.string().optional(),
  CONTINGENCYFee: z.string().optional(),
  FlatFee: z.string().optional(),
  IsArchived: z.boolean().default(false),
});

// Complete Submission Type
interface CompleteSubmission {
  propertyDetails: z.infer<typeof formSchema>;
  yearlyData: Record<number, Omit<TableRow, "year">>;
}

export default function EditProperty() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const propertyId = searchParams.get("propertyId");
  const years = [2021, 2022, 2023, 2024, 2025];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      IsArchived: false,
    },
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }

      try {
        const property = await getSingleProperty({ propertyId });
        if (property) {
          setProperty(property);
          form.reset(property[0]);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, form]);

  const invoices = property?.invoices;

  const initialTableData: TableRow[] = years.map((year) => {
    const yearData = invoices?.find((invoice) => invoice.year === year);
    return {
      year,
      "Protested Date": "-",
      "BPP Rendered": "",
      "Prelim Land": yearData?.BPPInvoice || "N/A",
      "Prelim Building": yearData?.BPPInvoicePaid || "N/A",
      "Prelim Total": yearData?.NoticeMarketValue || "N/A",
      "Assessed Prelim": "",
      "Final Land": "",
      "Final Building": "",
      "Final Total": "",
      "Assessed Final": "",
      "Hearing Date": "",
      "Invoice Date": "",
      "Under Litigation": false,
      "Under Arbitration": false,
      Reduction: "",
      "Tax Rate": "",
      "Taxes Saved": "",
      "Contingency Fee": yearData?.ArbitrationContingencyFee || "N/A",
      "Invoice Amount": yearData?.TotalDue || "N/A",
      "Paid Date": "",
      "Payment Notes": "",
    };
  });

  const [tableData, setTableData] = useState<TableRow[]>(initialTableData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnKey: keyof TableRow
  ) => {
    const { value } = e.target;
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnKey]: value } : row
      )
    );
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnKey: keyof TableRow
  ) => {
    const { checked } = e.target;
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnKey]: checked } : row
      )
    );
  };

const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
  try {
    const completeSubmission: CompleteSubmission = {
      propertyDetails: values,
      yearlyData: tableData.reduce((acc, row) => {
        const { year, ...rowWithoutYear } = row;
        acc[year] = rowWithoutYear;
        return acc;
      }, {} as Record<number, Omit<TableRow, "year">>),
    };

    // Call the editProperty API function
    await editProperty(
      propertyId!, // Add non-null assertion since we check for propertyId earlier
      completeSubmission.propertyDetails,
      completeSubmission.yearlyData
    );

    toast.success("Property updated successfully!");
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to update property. Please try again."
    );
  }
};

  // const revertChanges = () => {
  //   if (property) {
  //     form.reset(property[0]);
  //     setTableData(initialTableData);
  //   }
  // };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 m-2 py-10 px-6 bg-white rounded-lg shadow-lg"
      >
        <div className="border-b pb-4">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Edit Property
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form Fields */}
            <FormField
              control={form.control}
              name="NAMEONCAD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on CAD</FormLabel>
                  <Input placeholder="Enter Name on CAD" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="MAILINGADDRESS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mailing Address</FormLabel>
                  <Input placeholder="Enter Mailing Address" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="MAILINGADDRESSCITYTXZIP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mailing Address City/State/ZIP</FormLabel>
                  <Input
                    placeholder="Enter Mailing Address City/State/ZIP"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CADMailingADDRESS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAD Mailing Address</FormLabel>
                  <Input placeholder="Enter CAD Mailing Address" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CADCITY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAD City</FormLabel>
                  <Input placeholder="Enter CAD City" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CADZIPCODE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAD ZIP Code</FormLabel>
                  <Input placeholder="Enter CAD ZIP Code" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CADCOUNTY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAD County</FormLabel>
                  <Input placeholder="Enter CAD County" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="AccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <Input placeholder="Enter Account Number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CLIENTNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Number</FormLabel>
                  <Input placeholder="Enter Client Number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CONTACTOWNER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Owner</FormLabel>
                  <Input placeholder="Enter Contact Owner" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="SUBCONTRACTOWNER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcontract Owner</FormLabel>
                  <Input placeholder="Enter Subcontract Owner" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="BPPFEE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BPP Fee</FormLabel>
                  <Input placeholder="Enter BPP Fee" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CONTINGENCYFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contingency Fee</FormLabel>
                  <Input placeholder="Enter Contingency Fee" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="FlatFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flat Fee</FormLabel>
                  <Input placeholder="Enter Flat Fee" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status and Other Notes */}
          <div className="flex gap-4 justify-between">
            <FormField
              control={form.control}
              name="StatusNotes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status Notes</FormLabel>
                  <Input placeholder="Enter Status Notes" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="OtherNotes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Other Notes</FormLabel>
                  <Input placeholder="Enter Other Notes" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Yearly Invoice Data Table */}
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Editable Yearly Invoices Summary
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full text-left border-collapse bg-white rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <th className="px-6 py-3 text-sm font-medium uppercase"></th>
                  {years.map((year) => (
                    <th
                      key={year}
                      className="px-6 py-3 text-sm font-medium uppercase"
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(tableData[0]).map((key) => {
                  if (key === "year") return null;
                  return (
                    <tr
                      key={key}
                      className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
                    >
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">
                        {key}
                      </td>
                      {tableData.map((row, rowIndex) => (
                        <td
                          key={`${row.year}-${key}`}
                          className="px-6 py-3 text-sm text-gray-700"
                        >
                          {key === "Under Litigation" ||
                          key === "Under Arbitration" ? (
                            <div className="flex gap-4 justify-center items-center">
                              <input
                                type="checkbox"
                                checked={row[key as keyof TableRow] as boolean}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    e,
                                    rowIndex,
                                    key as keyof TableRow
                                  )
                                }
                                className="form-checkbox h-5 w-5 text-indigo-600"
                              />
                              <span>Yes</span>
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={row[key as keyof TableRow] as string}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  rowIndex,
                                  key as keyof TableRow
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit and Revert Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-[240px] text-gray-600"
            // onClick={revertChanges}
          >
            Revert Changes
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-[240px] bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
