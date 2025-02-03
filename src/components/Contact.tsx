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

const formSchema = z.object({
  ProspectName: z.string().min(1, "Prospect name is required"),
  Email: z.string().email("Invalid email address"),
  PHONENUMBER: z.string().optional(),
  MAILINGADDRESS: z.string().optional(),
  MAILINGADDRESSCITYTXZIP: z.string().optional(),
});

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ProspectName: "",
      Email: "",
      PHONENUMBER: "",
      MAILINGADDRESS: "",
      MAILINGADDRESSCITYTXZIP: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addProspect(
        values.ProspectName,
        values.Email,
        values.PHONENUMBER || "",
        values.MAILINGADDRESS || "",
        values.MAILINGADDRESSCITYTXZIP || ""
      );
      toast({
        title: "Received your Interest!",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMessage = "Failed to add prospect. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          errorMessage === "Email Already Present"
            ? "This email is already registered. Try a different one."
            : "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <div id="contact" className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center p-8 m-4 rounded-xl shadow-lg" >
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Contact Us</h1>
      <div className="w-full max-w-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white p-10 rounded-xl shadow-md border border-gray-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ProspectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Your Name
                    </FormLabel>
                    <Input
                      placeholder="Enter Your Name"
                      {...field}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <Input
                      placeholder="Enter Email"
                      type="email"
                      {...field}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="PHONENUMBER"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Phone Number
                    </FormLabel>
                    <Input
                      placeholder="Enter Phone Number"
                      {...field}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="MAILINGADDRESS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Mailing Address
                    </FormLabel>
                    <Input
                      placeholder="Enter Mailing Address"
                      {...field}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              variant="blue"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transition-all"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Contact;
