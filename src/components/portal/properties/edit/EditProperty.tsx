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
import { getSingleProperty } from "@/store/data"; // Assuming this is the function to fetch property data
import { PropertyData } from "@/types/types";
import EditableYearTable from "../yeardata/EditableYearTable";

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

export default function EditProperty() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      IsArchived: false,
    },
  });

  const propertyId = searchParams.get("propertyId");
  console.log(propertyId); // Check if the ID is correct

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
          console.log("line78", property);
          form.reset(property[0]); // Prefill the form with the property data
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
    console.log(property)
  }, [propertyId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call the API or function to update the property
      // await updateProperty({ propertyId, data: values });
      console.log("PROPERTY FORM DATA :", { values });
      toast.success("Property updated successfully!");
    } catch (error) {
      toast.error("Failed to update property. Please try again.");
    }
  };
  const revertChanges = () => {
    // form.reset(property); // Reset form to the fetched property data
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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

        <EditableYearTable invoices={property?.invoices}/>

        {/* Submit and Revert Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-[240px] text-gray-600"
            onClick={revertChanges}
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
