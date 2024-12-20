import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  // FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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

export default function AddPropertyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ls_prop_status: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast.success("Property added successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-4xl mx-auto py-10 px-6 bg-white rounded-lg shadow-lg"
      >
        {/* Property Information Section */}
        <div className="border-b pb-4">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Property Information
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <FormField
                control={form.control}
                name="ls_prop_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Input
                      placeholder="Enter City"
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
                name="ls_prop_state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Input
                      placeholder="Enter State"
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
                name="ls_prop_zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <Input
                      placeholder="Enter ZIP Code"
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
                name="ls_prop_assessor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessor</FormLabel>
                    <Input
                      placeholder="Enter Assessor"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="border-b pb-4 mt-8">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Additional Information
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="ls_prop_current_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Notes</FormLabel>
                    <Input
                      placeholder="Enter Current Notes"
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
                name="ls_prop_history_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History Notes</FormLabel>
                    <Input
                      placeholder="Enter History Notes"
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
                name="ls_prop_special_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Notes</FormLabel>
                    <Input
                      placeholder="Enter Special Notes"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* AOA Signed Date Section */}
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Property
        </Button>
      </form>
    </Form>
  );
}
