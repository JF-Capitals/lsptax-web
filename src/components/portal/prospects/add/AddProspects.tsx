import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { addProspect } from "@/api/api";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  ProspectName: z.string().min(1, "Prospect name is required"),
  Email: z.string().email("Invalid email address"),
  BillingEmail: z.string().email("Invalid billing email address"),
  PHONENUMBER: z.string().min(1, "Phone number is required"),
  MAILINGADDRESS: z.string().min(1, "Mailing Address is required"),
  MAILINGADDRESSCITYTXZIP: z.string().min(1, "City, State, ZIP is required"),
  BillingAddress: z.string().min(1, "City, State, ZIP is required"),
  IsArchived: z.boolean().optional(),
  useSameAsMailing: z.boolean().default(false),
  useSameAsEmail: z.boolean().default(false), // Add this field
});

export default function AddProspectForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Track loading state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ProspectName: "",
      Email: "",
      BillingEmail: "",
      PHONENUMBER: "",
      MAILINGADDRESSCITYTXZIP: "",
      useSameAsMailing: false, // Default value
      useSameAsEmail: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true); // Set loading to true
    try {
      await addProspect(
        values.ProspectName,
        values.Email,
        values.PHONENUMBER || "",
        values.MAILINGADDRESS || "",
        values.MAILINGADDRESSCITYTXZIP || ""
      );

      toast({
        title: "✓ Prospect added successfully",
      });

      form.reset();
    } catch (error) {
      if (error instanceof Error && error.message === "Email Already Present") {
        toast({
          variant: "destructive",
          title: "Email already exists",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add prospect",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-900">New Prospect</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="ProspectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input {...field} placeholder="Full name" />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="email@example.com"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                <FormLabel className="text-gray-700">Phone</FormLabel>
                <Input
                  {...field}
                  placeholder="+1 (555) 000-0000"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Street Address and City, State, ZIP */}
          <FormField
            control={form.control}
            name="MAILINGADDRESS"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Street Address</FormLabel>
                <Input
                  {...field}
                  placeholder="Street Address"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                <FormLabel className="text-gray-700">
                  City, State, ZIP
                </FormLabel>
                <Input
                  {...field}
                  placeholder="City, TX ZIP"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    field.onChange(e); // Update the field value
                    // Automatically update BillingAddress if the checkbox is checked
                    if (form.getValues("useSameAsMailing")) {
                      form.setValue(
                        "BillingAddress",
                        `${form.getValues("MAILINGADDRESS")}, ${e.target.value}`
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
          <h2 className="text-lg font-semibold text-gray-800 my-2">
            Client Info
          </h2>
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
                        form.setValue("BillingEmail", form.getValues("Email"));
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
                <FormLabel className="text-gray-700">Billing Email</FormLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="billing@example.com"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  readOnly={form.getValues("useSameAsEmail")} // Make it read-only if the checkbox is checked
                />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Checkbox for using the same address */}
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

          {/* Billing Address */}
          <FormField
            control={form.control}
            name="BillingAddress"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="text-gray-700">Billing Address</FormLabel>
                <Input
                  {...field}
                  placeholder="Street, City, TX ZIP"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  readOnly={form.getValues("useSameAsMailing")} // Make it read-only if the checkbox is checked
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-8">
          <Button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                Adding Prospect...
              </>
            ) : (
              "Add Prospect"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
