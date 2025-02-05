import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { Prospect } from "@/types/types";
import { getSingleProspect } from "@/store/data";

const MoveFromProspect = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prospectData, setProspectData] = useState<Prospect | null>(null);
  const [searchParams] = useSearchParams();
  const prospectId = searchParams.get("prospectId");

  useEffect(() => {
    async function loadProspectData() {
      try {
        if (prospectId) {
          const data = await getSingleProspect({ prospectId });
          setProspectData(data);
          // Update form values when prospect data is loaded
          form.reset({
            CLIENTNAME: data.ProspectName,
            Email: data.Email,
            PHONENUMBER: data.PHONENUMBER,
            MAILINGADDRESSCITYTXZIP: data.MAILINGADDRESSCITYTXZIP,
            TypeOfAcct: "Real",
            IsArchived: false,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load prospect data", error);
        // toast( tit"Could not load client data. Please try again later.");
        setError("Error getting prospect details");
      }
    }
    if (prospectId) {
      loadProspectData();
    }
    console.log({ prospectData });
  }, [searchParams]);

  const formSchema = z.object({
    TypeOfAcct: z.string().optional(),
    CLIENTNumber: z.string().optional(),
    CLIENTNAME: z.string().min(1, "Client name is required"),
    Email: z.string().email("Invalid email address"),
    PHONENUMBER: z.string().min(1, "Phone number is required"),
    MAILINGADDRESSCITYTXZIP: z.string().min(1, "City, State, ZIP is required"),
    IsArchived: z.boolean().optional(),
  });
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
          title: "Failed to add client",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  }
  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Moving Prospect to Client
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="CLIENTNAME"
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
            name="TypeOfAcct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
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
            name="MAILINGADDRESSCITYTXZIP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <Input {...field} placeholder="City, TX ZIP" />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8">
          <Button variant="blue" type="submit" className="w-full md:w-auto">
            Add Client
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MoveFromProspect;
