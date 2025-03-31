import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addClient } from "@/api/api";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  TypeOfAcct: z.string().optional(),
  CLIENTNumber: z.string().optional(),
  CLIENTNAME: z.string().min(1, "Client name is required"),
  Email: z.string().email("Invalid email address"),
  BillingEmail: z.string().email("Invalid billing email address"),
  PHONENUMBER: z.string().min(1, "Phone number is required"),
  MAILINGADDRESS: z.string().min(1, "Mailing Address is required"),
  MAILINGADDRESSCITYTXZIP: z.string().min(1, "City, State, ZIP is required"),
  BillingAddress: z.string().min(1, "City, State, ZIP is required"),
  IsArchived: z.boolean().optional(),
  useSameAsMailing: z.boolean().default(false),
  useSameAsEmail: z.boolean().default(false),
});

export default function AddClientForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      IsArchived: false,
      CLIENTNAME: "",
      Email: "",
      BillingEmail: "",
      PHONENUMBER: "",
      MAILINGADDRESS: "",
      MAILINGADDRESSCITYTXZIP: "",
      BillingAddress: "",
      TypeOfAcct: "Real",
      useSameAsMailing: false,
      useSameAsEmail: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Set loading state
    try {
      if (!values) { 
        await addClient(values);
      }

      toast({
        title: "✓ Client added successfully",
        description: "The client has been added to the system.",
      });

      form.reset();
    } catch (error) {
      if (error instanceof Error && error.message === "Email Already Present") {
        toast({
          variant: "destructive",
          title: "Email already exists",
          description: "A client with this email already exists.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add client",
          description: "An unexpected error occurred. Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Client
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="CLIENTNAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <Input {...field} className="border-gray-300 rounded-lg" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    {...field}
                    className="border-gray-300 rounded-lg"
                    onChange={(e) => {
                      field.onChange(e); // Update the field value
                      // Automatically update BillingEmail if the checkbox is checked
                      if (form.getValues("useSameAsEmail")) {
                        form.setValue("BillingEmail", e.target.value);
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="PHONENUMBER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <Input {...field} className="border-gray-300 rounded-lg" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="MAILINGADDRESS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <Input
                    {...field}
                    placeholder="Street Address"
                    className="border-gray-300 rounded-lg"
                    onChange={(e) => {
                      field.onChange(e); // Update the field value
                      // Automatically update BillingAddress if the checkbox is checked
                      if (form.getValues("useSameAsMailing")) {
                        form.setValue(
                          "BillingAddress",
                          `${e.target.value}, ${form.getValues(
                            "MAILINGADDRESSCITYTXZIP"
                          )}`
                        );
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="MAILINGADDRESSCITYTXZIP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City, State, ZIP</FormLabel>
                  <Input
                    {...field}
                    placeholder="City, TX ZIP"
                    className="border-gray-300 rounded-lg"
                    onChange={(e) => {
                      field.onChange(e); // Update the field value
                      // Automatically update BillingAddress if the checkbox is checked
                      if (form.getValues("useSameAsMailing")) {
                        form.setValue(
                          "BillingAddress",
                          `${form.getValues("MAILINGADDRESS")}, ${
                            e.target.value
                          }`
                        );
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-full">
            <FormField
              control={form.control}
              name="useSameAsEmail"
              render={({ field }) => {
                const email = form.watch("Email");
                const isDisabled = !email; // Disable if the normal email is empty

                return (
                  <FormItem className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="useSameAsEmail"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked); // Update the checkbox value
                        if (e.target.checked) {
                          // Set BillingEmail to the value of Email
                          form.setValue(
                            "BillingEmail",
                            form.getValues("Email")
                          );
                        }
                      }}
                      className="mr-2"
                      disabled={isDisabled} // Disable the checkbox if the normal email is empty
                    />
                    <FormLabel
                      htmlFor="useSameAsEmail"
                      className={`text-gray-700 ${
                        isDisabled ? "opacity-50" : ""
                      }`} // Add opacity for disabled state
                    >
                      Use the same email for billing
                    </FormLabel>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="BillingEmail"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Billing Email</FormLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="billing@example.com"
                    className="border-gray-300 rounded-lg"
                    readOnly={form.getValues("useSameAsEmail")} // Make it read-only if the checkbox is checked
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useSameAsMailing"
              render={({ field }) => {
                const mailingAddress = form.watch("MAILINGADDRESS");
                const mailingAddressCityTxZip = form.watch(
                  "MAILINGADDRESSCITYTXZIP"
                );
                const isDisabled = !mailingAddress || !mailingAddressCityTxZip; // Disable if either field is empty

                return (
                  <FormItem className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="useSameAsMailing"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked); // Update the checkbox value
                        if (e.target.checked) {
                          // Set BillingAddress to the combination of MAILINGADDRESS and MAILINGADDRESSCITYTXZIP
                          form.setValue(
                            "BillingAddress",
                            `${form.getValues(
                              "MAILINGADDRESS"
                            )}, ${form.getValues("MAILINGADDRESSCITYTXZIP")}`
                          );
                        }
                      }}
                      className="mr-2"
                      disabled={isDisabled} // Disable the checkbox if required fields are empty
                    />
                    <FormLabel
                      htmlFor="useSameAsMailing"
                      className={`text-gray-700 ${
                        isDisabled ? "opacity-50" : ""
                      }`} // Add opacity for disabled state
                    >
                      Use the same address for billing
                    </FormLabel>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="BillingAddress"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Billing Address</FormLabel>
                  <Input
                    {...field}
                    placeholder="Street, City, TX ZIP"
                    className="border-gray-300 rounded-lg"
                    readOnly={form.getValues("useSameAsMailing")} // Make it read-only if the checkbox is checked
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="TypeOfAcct"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Account Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Real">Real</SelectItem>
                    <SelectItem value="BPP">BPP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              variant="blue"
              className="w-64 flex items-center justify-center"
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                  Adding Client...
                </>
              ) : (
                "Add Client"
              )}
            </Button>
            <Button
              variant="secondary"
              className="w-64"
              onClick={() => form.reset()}
              disabled={isSubmitting} // Disable reset button while submitting
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
