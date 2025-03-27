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
import { getProspectProperty } from "@/store/data";
import { PropertyData } from "@/types/types";
import { editProspectProperty } from "@/api/api";
import { LoaderCircle } from "lucide-react";

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
}

export default function EditProspectProperty() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<z.infer<
    typeof formSchema
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [error, setError] = useState<string | null>(null);
  const [, setProperty] = useState<PropertyData | null>(null);
  const propertyId = searchParams.get("id");

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
    setIsSubmitting(true);

    try {
      const completeSubmission: CompleteSubmission = {
        propertyDetails: pendingValues,
      };

      await editProspectProperty(
        propertyId!,
        completeSubmission.propertyDetails
      );

      toast({ title: "Property updated successfully!" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Failed to update property", variant: "destructive" });
    } finally {
      setIsSubmitting(false); // Reset submitting state
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
        const property = await getProspectProperty({ propertyId });
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

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
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
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                    Saving...
                  </>
                ) : (
                  "Continue"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
