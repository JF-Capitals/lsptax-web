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
  PHONENUMBER: z.string().min(1, "Phone number is required"),
  MAILINGADDRESSCITYTXZIP: z.string().min(1, "City, State, ZIP is required"),
  IsArchived: z.boolean().optional(),
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
      PHONENUMBER: "",
      MAILINGADDRESSCITYTXZIP: "",
      TypeOfAcct: "Real",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Set loading state
    try {
      await addClient(
        values.CLIENTNAME,
        values.Email,
        values.PHONENUMBER,
        values.MAILINGADDRESSCITYTXZIP,
        values.TypeOfAcct || ""
      );

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Client</h1>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="CLIENTNAME"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Name</FormLabel>
                <Input
                  {...field}
                  placeholder="Full name"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="MAILINGADDRESSCITYTXZIP"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Address</FormLabel>
                <Input
                  {...field}
                  placeholder="City, TX ZIP"
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            variant="blue"
            type="submit"
            className="w-full md:w-auto flex items-center justify-center"
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
        </div>
      </form>
    </Form>
  );
}