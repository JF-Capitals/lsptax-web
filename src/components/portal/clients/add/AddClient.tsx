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
  ls_client_number: z.string().nonempty("Client number is required"),
  ls_client_is_prospect: z.number().int(),
  ls_client_co_id: z.number().optional(),
  ls_client_subco_id: z.number().optional(),
  ls_client_fname: z.string().optional(),
  ls_client_lname: z.string().optional(),
  ls_client_name: z.string().nonempty("Client name is required"),
  ls_client_email: z.string().email("Invalid email address").optional(),
  ls_client_phone: z.string().optional(),
  ls_client_mobile: z.string().optional(),
  ls_client_fax: z.string().optional(),
  ls_client_job_title: z.string().optional(),
  ls_client_dob: z.date().optional(),
  ls_client_street: z.string().optional(),
  ls_client_city: z.string().optional(),
  ls_client_state: z.string().optional(),
  ls_client_zip: z.string().optional(),
  ls_client_country: z.string().default("USA"),
  contract_type: z.string().optional(),
  ls_client_fixed_fee: z.string().optional(),
  ls_client_cont_fee: z.string().optional(),
  ls_client_bpp_fixed_fee: z.string().optional(),
  ls_client_notes: z.string().optional(),
});

export default function AddClientForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ls_client_country: "USA",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast.success("Client added successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 m-3 py-10 px-6 bg-white rounded-lg shadow-lg"
      >
        {/* Client Details Section */}
        <div className="border-b pb-4">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Client Information
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <FormField
                control={form.control}
                name="ls_client_fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      placeholder="Enter First Name"
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
                name="ls_client_lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      placeholder="Enter Last Name"
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
                name="ls_client_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Number</FormLabel>
                    <Input
                      placeholder="Enter Client Number"
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
                name="ls_client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <Input
                      placeholder="Enter Client Name"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <FormField
                control={form.control}
                name="ls_client_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      placeholder="Enter Email"
                      type="email"
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
                name="ls_client_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      placeholder="Enter Phone Number"
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
                name="ls_client_mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <Input
                      placeholder="Enter Mobile Number"
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
                name="ls_client_fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fax Number</FormLabel>
                    <Input
                      placeholder="Enter Fax Number"
                      {...field}
                      className="border-gray-300"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Date of Birth Section */}
          <div className="mt-6">
            <FormField
              control={form.control}
              name="ls_client_dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full sm:w-[240px] pl-3 mx-4 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-g-100 text-black" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="border-b pb-4 mt-8">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Additional Information
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <FormField
                control={form.control}
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Input
                      placeholder="Enter Contract Type"
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
                name="ls_client_fixed_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fixed Fee</FormLabel>
                    <Input
                      placeholder="Enter Fixed Fee"
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
                name="ls_client_cont_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contingency Fee</FormLabel>
                    <Input
                      placeholder="Enter Contingency Fee"
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
                name="ls_client_bpp_fixed_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BPP Fixed Fee</FormLabel>
                    <Input
                      placeholder="Enter BPP Fixed Fee"
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

        {/* Notes Section */}
        <div className="mt-8">
          <FormField
            control={form.control}
            name="ls_client_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <Input
                  placeholder="Enter any additional notes"
                  {...field}
                  className="border-gray-300"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" variant={"blue"} className="mt-6 w-64">
          Submit
        </Button>
      </form>
    </Form>
  );
}

