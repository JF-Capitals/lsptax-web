import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { LoaderCircle } from "lucide-react";

type TableRow = {
  year: number;
  "Protest Date": string;
  "BPP Rendered": string;
  "BPP Invoice": string;
  "BPP Paid": string;
  "Notice Land Value": string;
  "Notice Improvement Value": string;
  "Notice Market Value": string;
  "Notice Appraised Value": string;
  "Final Land Value": string;
  "Final Improvement Value": string;
  "Final Market Value": string;
  "Final Appraised Value": string;
  "Market Reduction": string;
  "Appraised Reduction": string;
  "Hearing Date"?: string;
  "Invoice Date"?: string;
  "Under Litigation": boolean;
  "Under Arbitration": boolean;
  "Tax Rate": string;
  "Taxable Savings": string;
  "Contingency Fee"?: string;
  "Invoice Amount"?: string;
  "Paid Date"?: string;
  "Payment Notes"?: string;
  "Beginning Market": string;
  "Ending Market": string;
  "Beginning Appraised": string;
  "Ending Appraised": string;
};

const formSchema = z.object({
  StatusNotes: z.string().nullable().default(""),
  OtherNotes: z.string().nullable().default(""),
  NAMEONCAD: z.string().optional().default(""),
  MAILINGADDRESS: z.string().optional().default(""),
  MAILINGADDRESSCITYTXZIP: z.string().optional().default(""),
  CADMailingADDRESS: z.string().optional().default(""),
  CADCITY: z.string().optional().default(""),
  CADZIPCODE: z.string().optional().default(""),
  CADCOUNTY: z.string().optional().default(""),
  AccountNumber: z.string().optional().default(""),
  CLIENTNumber: z.string().optional().default(""),
  CONTACTOWNER: z.string().nullable().default(""),
  SUBCONTRACTOWNER: z.string().nullable().default(""),
  BPPFEE: z.string().optional().default(""),
  CONTINGENCYFee: z.string().optional().default(""),
  FlatFee: z.string().optional().default(""),
  IsArchived: z.boolean().optional().default(false),
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
  const navigate = useNavigate();
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
    setLoading(true);
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
      navigate(`/portal/property?propertyId=${propertyId}`);
    } catch (error) {
      toast({ title: "Failed to update property", variant: "destructive" });
    } finally {
      setLoading(false); // Set loading to false after submission
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

      const noticeLandValue = parseFloat(yearData?.noticeLandValue) || 0;
      const noticeImprovementValue =
        parseFloat(yearData?.noticeImprovementValue) || 0;
      const noticeAppraisedValue =
        parseFloat(yearData?.noticeAppraisedValue) || 0;
      const finalLandValue = parseFloat(yearData?.finalLandValue) || 0;
      const finalImprovementValue =
        parseFloat(yearData?.finalImprovementValue) || 0;
      const finalAppraisedValue =
        parseFloat(yearData?.finalAppraisedValue) || 0;
      const taxRate = parseFloat(yearData?.taxRate) || 0;
      const endingMarket = parseFloat(yearData?.endingMarket) || 0;
      const endingAppraised = parseFloat(yearData?.endingAppraised) || 0;

      // Parse contingency fee from string (e.g., "25%" -> 0.25)
      const contingencyFeeString =
        property?.propertyDetails.CONTINGENCYFee || "0%"; // Default to "0%" if not provided
      const contingencyFeePercentage = parseFloat(contingencyFeeString); // Extract the numeric value
      const contingencyFee = contingencyFeePercentage / 100; // Convert to decimal (e.g., 25% -> 0.25)

      const noticeMarketValue = noticeLandValue + noticeImprovementValue;
      const finalMarketValue = finalLandValue + finalImprovementValue;
      const marketReduction = noticeMarketValue - finalMarketValue;
      const appraisedReduction = noticeAppraisedValue - finalAppraisedValue;
      const taxableSavings = marketReduction * (taxRate / 100);
      const invoiceAmount = taxableSavings * contingencyFee;

      const beginningMarket =
        yearData?.underLitigation || yearData?.underArbitration
          ? finalMarketValue
          : 0;
      const beginningAppraised =
        yearData?.underLitigation || yearData?.underArbitration
          ? finalAppraisedValue
          : 0;

      return {
        year,
        "Protest Date": yearData?.protestDate || "",
        "BPP Rendered": yearData?.bppRendered || "",
        "BPP Invoice": yearData?.bppInvoice || "",
        "BPP Paid": yearData?.bppPaid || "",
        "Notice Land Value": noticeLandValue.toString(),
        "Notice Improvement Value": noticeImprovementValue.toString(),
        "Notice Market Value": noticeMarketValue.toString(),
        "Notice Appraised Value": noticeAppraisedValue.toString(),
        "Final Land Value": finalLandValue.toString(),
        "Final Improvement Value": finalImprovementValue.toString(),
        "Final Market Value": finalMarketValue.toString(),
        "Final Appraised Value": finalAppraisedValue.toString(),
        "Market Reduction": marketReduction.toString(),
        "Appraised Reduction": appraisedReduction.toString(),
        "Hearing Date": yearData?.hearingDate || "",
        "Invoice Date": yearData?.invoiceDate || "",
        "Under Litigation": yearData?.underLitigation || false,
        "Under Arbitration": yearData?.underArbitration || false,
        "Tax Rate": taxRate.toString(),
        "Taxable Savings": taxableSavings.toString(),
        "Contingency Fee": contingencyFeeString, // Keep as string for display
        "Invoice Amount": invoiceAmount.toString(),
        "Paid Date": yearData?.paidDate || "",
        "Payment Notes": yearData?.paymentNotes || "",
        "Beginning Market": beginningMarket.toString(),
        "Ending Market": endingMarket.toString(),
        "Beginning Appraised": beginningAppraised.toString(),
        "Ending Appraised": endingAppraised.toString(),
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

    // Update the specific field
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnKey]: value } : row
      )
    );

    // Recalculate dependent fields
    recalculateFields(rowIndex);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnKey: keyof TableRow
  ) => {
    const { checked } = e.target;

    // Update the checkbox field
    setTableData((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [columnKey]: checked } : row
      )
    );

    // Recalculate dependent fields
    recalculateFields(rowIndex);
  };

  const recalculateFields = (rowIndex: number) => {
    setTableData((prev) =>
      prev.map((row, idx) => {
        if (idx !== rowIndex) return row; // Only update the current row

        const noticeLandValue = parseFloat(row["Notice Land Value"]) || 0;
        const noticeImprovementValue =
          parseFloat(row["Notice Improvement Value"]) || 0;
        const noticeAppraisedValue =
          parseFloat(row["Notice Appraised Value"]) || 0;
        const finalLandValue = parseFloat(row["Final Land Value"]) || 0;
        const finalImprovementValue =
          parseFloat(row["Final Improvement Value"]) || 0;
        const finalAppraisedValue =
          parseFloat(row["Final Appraised Value"]) || 0;
        const taxRate = parseFloat(row["Tax Rate"]) || 0;
        const endingMarket = parseFloat(row["Ending Market"]) || 0;
        const endingAppraised = parseFloat(row["Ending Appraised"]) || 0;

        // Parse contingency fee from string (e.g., "25%" -> 0.25)
        const contingencyFeeString = row["Contingency Fee"] || "0%"; // Default to "0%" if not provided
        const contingencyFeePercentage = parseFloat(contingencyFeeString); // Extract the numeric value
        const contingencyFee = contingencyFeePercentage / 100; // Convert to decimal (e.g., 25% -> 0.25)

        // Calculate dependent fields
        const noticeMarketValue = noticeLandValue + noticeImprovementValue;
        const finalMarketValue = finalLandValue + finalImprovementValue;
        const marketReduction = noticeMarketValue - finalMarketValue;
        const appraisedReduction = noticeAppraisedValue - finalAppraisedValue;
        const taxableSavings = marketReduction * (taxRate / 100);
        const invoiceAmount = taxableSavings * contingencyFee; // Use contingencyFee as a number

        const beginningMarket =
          row["Under Litigation"] || row["Under Arbitration"]
            ? finalMarketValue
            : 0;
        const beginningAppraised =
          row["Under Litigation"] || row["Under Arbitration"]
            ? finalAppraisedValue
            : 0;

        return {
          ...row,
          "Notice Market Value": noticeMarketValue.toString(),
          "Final Market Value": finalMarketValue.toString(),
          "Market Reduction": marketReduction.toString(),
          "Appraised Reduction": appraisedReduction.toString(),
          "Taxable Savings": taxableSavings.toString(),
          "Invoice Amount": invoiceAmount.toString(),
          "Beginning Market": beginningMarket.toString(),
          "Beginning Appraised": beginningAppraised.toString(),
          "Ending Market": endingMarket.toString(),
          "Ending Appraised": endingAppraised.toString(),
          "Contingency Fee": contingencyFeeString, // Keep as string for display
        };
      })
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
                  <FormLabel>Contract Owner</FormLabel>
                  <Input
                    placeholder="Enter Contract Owner Name"
                    {...field}
                    value={field.value ?? ""}
                  />
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
                  <Input
                    placeholder="Enter Subcontract Owner"
                    {...field}
                    value={field.value ?? ""}
                  />
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

            {/* <FormField
              control={form.control}
              name="FlatFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flat Fee</FormLabel>
                  <Input placeholder="Enter Flat Fee" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          {/* Status and Other Notes */}
          <div className="flex mt-4 gap-4 justify-between">
            <FormField
              control={form.control}
              name="StatusNotes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status Notes</FormLabel>
                  <Input
                    placeholder="Enter Status Notes"
                    {...field}
                    value={field.value ?? ""}
                  />
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
                  <Input
                    placeholder="Enter Other Notes"
                    {...field}
                    value={field.value ?? ""}
                  />
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

                const isCalculatedField = [
                  "Notice Market Value",
                  "Final Market Value",
                  "Market Reduction",
                  "Appraised Reduction",
                  "Taxable Savings",
                  "Invoice Amount",
                  "Beginning Market",
                  "Beginning Appraised",
                ].includes(key);

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
                        ) : isCalculatedField ? (
                          <input
                            type="text"
                            value={row[key as keyof TableRow] as string}
                            readOnly
                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
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
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="w-32"
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="w-32 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
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
