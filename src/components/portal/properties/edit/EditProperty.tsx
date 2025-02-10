import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { getSingleProperty } from "@/store/data";
import { PropertyData } from "@/types/types";
import { editProperty } from "@/api/api";

type TableRow = {
  year: number;
  "Protested Date": string;
  "BPP Rendered": string;
  "BPP Invoice": string;
  "BPP Invoice Paid": string;
  "Notice Market Value": string;
  "Assessed Prelim": string | undefined;
  "Final Prelim": string;
  "Final Market Value": string;
  "Market Value Reduction": string;
  "Hearing Date": string | undefined;
  "Invoice Date": string | undefined;
  "Under Litigation": boolean;
  "Under Arbitration": boolean;
  "Contingency Fee": string;
  "Invoice Amount": string;
  "Paid Date": string | undefined;
  "Payment Notes": string | undefined;
};

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

interface CompleteSubmission {
  propertyDetails: z.infer<typeof formSchema>;
  yearlyData: Record<number, Omit<TableRow, "year">>;
}

export default function EditProperty() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<z.infer<
    typeof formSchema
  > | null>(null);
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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setPendingValues(values);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;

    try {
      const completeSubmission: CompleteSubmission = {
        propertyDetails: pendingValues,
        yearlyData: tableData.reduce((acc, row) => {
          const { year, ...rowWithoutYear } = row;
          acc[year] = rowWithoutYear;
          return acc;
        }, {} as Record<number, Omit<TableRow, "year">>),
      };

      await editProperty(
        propertyId!,
        completeSubmission.propertyDetails,
        completeSubmission.yearlyData
      );

      toast({ title: "Property updated successfully!" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Failed to update property", variant: "destructive" });
    }
  };
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
          form.reset(property.propertyDetails);
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

  const getInitialTableData = (invoices: any[] = []) => {
    return years.map((year) => {
      const yearData = invoices?.find((invoice) => invoice.year === year);
      return {
        year,
        "Protested Date": yearData?.protestedDate || "-",
        "BPP Rendered": "-",
        "BPP Invoice": yearData?.BPPInvoice || "-",
        "BPP Invoice Paid": yearData?.BPPInvoicePaid || "-",
        "Notice Market Value": yearData?.NoticeMarketValue || "-",
        "Assessed Prelim": yearData?.NoticeAppraisedValue || "-",
        "Final Prelim": yearData?.FinalAppraisedValue || "-",
        "Final Market Value": yearData?.FinalMarketValue || "-",
        "Market Value Reduction": yearData?.MarketValueReduction || "-",
        "Hearing Date": yearData?.hearingDate || "-",
        "Invoice Date": yearData?.invoiceDate || "-",
        "Under Litigation": yearData?.underLitigation || false,
        "Under Arbitration": yearData?.underArbitration || false,
        "Contingency Fee": yearData?.ArbitrationContingencyFee || "-",
        "Invoice Amount": yearData?.TotalDue || "-",
        "Paid Date": yearData?.paidDate || "-",
        "Payment Notes": yearData?.paymentNotes || "-",
      };
    });
  };
  useEffect(() => {
    if (property?.invoices) {
      setTableData(getInitialTableData(property.invoices));
    }
  }, [property]);

  const [tableData, setTableData] = useState<TableRow[]>(getInitialTableData());

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

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
                  <Input
                    readOnly
                    placeholder="Enter Client Number"
                    {...field}
                  />
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

        {/* Yearly Data Table */}
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th></th>
                {years.map((year) => (
                  <th
                    key={year}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(tableData[0]).map((key) => {
                if (key === "year") return null;
                return (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {key}
                    </td>
                    {tableData.map((row, rowIndex) => (
                      <td
                        key={`${row.year}-${key}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {key === "Under Litigation" ||
                        key === "Under Arbitration" ? (
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
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
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to save these changes? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
