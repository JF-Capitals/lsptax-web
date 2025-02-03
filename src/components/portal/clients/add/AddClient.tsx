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
import { addClient } from "@/api/api";

const formSchema = z.object({
  TypeOfAcct: z.string().optional(),
  CLIENTNumber: z.string().nonempty("Client number is required"),
  CLIENTNAME: z.string().optional(),
  Email: z.string().email("Invalid email address").optional(),
  PHONENUMBER: z.string().optional(),
  MAILINGADDRESS: z.string().optional(),
  MAILINGADDRESSCITYTXZIP: z.string().optional(),
  IsArchived: z.boolean().optional(),
});

export default function AddClientForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      IsArchived: false,
      CLIENTNAME:"",
      Email: "",
      PHONENUMBER: "",
      MAILINGADDRESS: "",
      MAILINGADDRESSCITYTXZIP: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
    try {
      if (
        !values.CLIENTNAME ||
        !values.Email ||
        !values.PHONENUMBER ||
        !values.MAILINGADDRESS ||
        !values.MAILINGADDRESSCITYTXZIP
      ) {
        toast({
          title: "Missing Data!",
        });
        return;
      }
      await addClient(
        values.CLIENTNAME,
        values.Email,
        values.PHONENUMBER || "",
        values.MAILINGADDRESS || "",
        values.MAILINGADDRESSCITYTXZIP || "",
        values.TypeOfAcct|| "",
      );
      toast({
        title: "Client added successfully!",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "Failed to add client. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage === "Email Already Present") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "This email is already registered. Try a different one.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 m-3 py-10 px-6 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          Client Information
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <FormField
              control={form.control}
              name="CLIENTNAME"
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

          <div>
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <FormField
              control={form.control}
              name="PHONENUMBER"
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
              name="MAILINGADDRESS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mailing Address</FormLabel>
                  <Input
                    placeholder="Enter Mailing Address"
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
              name="MAILINGADDRESSCITYTXZIP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mailing Address (City, TX, ZIP)</FormLabel>
                  <Input
                    placeholder="Enter City, TX, ZIP"
                    {...field}
                    className="border-gray-300"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" variant="blue" className="mt-6 w-64">
          Submit
        </Button>
      </form>
    </Form>
  );
}
