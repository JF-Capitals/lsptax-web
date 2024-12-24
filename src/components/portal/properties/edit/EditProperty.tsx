import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getSingleProperty } from "@/store/data"; // Assuming this is the function to fetch property data
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// import { updateProperty } from "@/store/data"; // Assuming you have a function to update the property data

const formSchema = z.object({
  ls_prop_client_id: z.number().int().nonnegative(),
  ls_prop_cad_owner: z.string().optional(),
  ls_prop_cad_address: z.string().optional(),
  ls_prop_cad_mailing_address: z.string().optional(),
  ls_prop_account_number: z.string().optional(),
  ls_prop_type: z.string().optional(),
  ls_prop_class: z.string().optional(),
  ls_prop_aoa_signed_on: z.date().optional(),
  ls_prop_protest: z.number().int().optional(),
  ls_prop_street: z.string().optional(),
  ls_prop_city: z.string().optional(),
  ls_prop_state: z.string().optional(),
  ls_prop_zip: z.string().optional(),
  ls_prop_assessor: z.string().optional(),
  ls_prop_current_notes: z.string().optional(),
  ls_prop_history_notes: z.string().optional(),
  ls_prop_special_notes: z.string().optional(),
  ls_prop_status: z.number().int().default(1),
  ls_prop_added_on: z.date().default(new Date()),
  ls_prop_added_by: z.number().optional(),
  ls_prop_updated_on: z.date().optional(),
  ls_prop_updated_by: z.number().optional(),
});

export default function EditProperty() {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ls_prop_status: 1,
    },
  });

  const propertyId = Number(searchParams.get("propertyId"));
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
          console.log("line78",property);
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
  }, [propertyId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call the API or function to update the property
      // await updateProperty({ propertyId, data: values });
      console.log("PROPERTY FORM DATA :",{values})
      toast.success("Property updated successfully!");
    } catch (error) {
      toast.error("Failed to update property. Please try again.");
    }
  };
  const revertChanges = () => {
    form.reset(property); // Reset form to the fetched property data
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
        className="space-y-8 max-w-4xl mx-auto py-10 px-6 bg-white rounded-lg shadow-lg"
      >
        <div className="border-b pb-4">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Edit Property
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="ls_prop_cad_owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CAD Owner</FormLabel>
                    <Input
                      placeholder="Enter CAD Owner"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="ls_prop_cad_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CAD Address</FormLabel>
                    <Input
                      placeholder="Enter CAD Address"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* More fields for other property details */}
          {/* Repeating the same form structure for other fields */}

          {/* For simplicity, I'll repeat the structure for the remaining fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <FormField
                control={form.control}
                name="ls_prop_account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <Input
                      placeholder="Enter Account Number"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="ls_prop_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Input
                      placeholder="Enter Property Type"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <FormField
                control={form.control}
                name="ls_prop_class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Class</FormLabel>
                    <Input
                      placeholder="Enter Property Class"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="ls_prop_street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <Input
                      placeholder="Enter Street"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Date Picker for AOA Signed Date */}
          <div className="mt-6">
            <FormField
              control={form.control}
              name="ls_prop_aoa_signed_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AOA Signed Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full sm:w-[240px] pl-3 text-left font-normal"
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Select a date"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        selected={field.value}
                        // onChange={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
        </div>

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
