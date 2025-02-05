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

export default function AddProspectForm() {
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
                <FormLabel>Email</FormLabel>
                <Input
                  {...field}
                  type="email"
                  placeholder="email@example.com"
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
                <FormLabel>Phone</FormLabel>
                <Input {...field} placeholder="+1 (555) 000-0000" />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="MAILINGADDRESS"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <Input {...field} placeholder="Street address" />
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
                <Input {...field} placeholder="City, TX ZIP" />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8">
          <Button type="submit" className="w-full md:w-auto">
            Add Prospect
          </Button>
        </div>
      </form>
    </Form>
  );
}
