import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"; // Add this import
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { addProperty } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
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

export default function AddPropertyForm() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [loading, setLoading] = useState(false); // Track loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      IsArchived: false,
      CLIENTNumber: clientId || "", // Pre-fill client number from URL
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true); // Set loading to true
    try {
      const propertyData = {
        StatusNotes: values.StatusNotes,
        OtherNotes: values.OtherNotes,
        NAMEONCAD: values.NAMEONCAD,
        MAILINGADDRESS: values.MAILINGADDRESS,
        MAILINGADDRESSCITYTXZIP: values.MAILINGADDRESSCITYTXZIP,
        CADMailingADDRESS: values.CADMailingADDRESS,
        CADCITY: values.CADCITY,
        CADZIPCODE: values.CADZIPCODE,
        CADCOUNTY: values.CADCOUNTY,
        AccountNumber: values.AccountNumber,
        CONTACTOWNER: values.CONTACTOWNER,
        SUBCONTRACTOWNER: values.SUBCONTRACTOWNER,
        BPPFEE: values.BPPFEE,
        CONTINGENCYFee: values.CONTINGENCYFee,
        FlatFee: values.FlatFee,
      };

      const newProperty = await addProperty({
        CLIENTNumber: clientId!,
        propertyData,
      });
      window.location.href = `/portal/property?propertyId=${newProperty?.property.id}`;

      toast({
        title: "Property Added",
        description: "The property has been successfully added.",
      });

      form.reset();
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        variant: "destructive",
        title: "Failed to Add Property",
        description:
          "An error occurred while adding the property. Please try again.",
      });
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 m-4 py-10 px-6 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          Add Property for Client : #{clientId}
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
                <Input required placeholder="Enter Account Number" {...field} />
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
                  {...field}
                  readOnly
                  value={clientId || ""}
                  className="bg-gray-50"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
              Adding Property...
            </>
          ) : (
            "Add Property"
          )}
        </Button>
      </form>
    </Form>
  );
}
