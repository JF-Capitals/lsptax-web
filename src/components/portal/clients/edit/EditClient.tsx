import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
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
import { getSingleClient } from "@/store/data";
import { ClientData, Property } from "@/types/types";

interface Client {
  client: ClientData;
  properties: Property[];
}

export default function EditClient() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  useEffect(() => {
    async function loadClientData() {
      try {
        if (clientId) {
          const data = await getSingleClient({ clientId });
          setClient(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load client data", error);
        toast.error("Could not load client data. Please try again later.");
        setError("Error getting client details");
      }
    }
    if (clientId) {
      loadClientData();
    }
  }, [searchParams]);

  const formSchema = z.object({
    TypeOfAcct: z
      .string()
      .optional()
      .default(client?.client.TypeOfAcct || "ty"),
    CLIENTNumber: z.string().nonempty(client?.client.CLIENTNumber || ""),
    CLIENTNAME: z
      .string()
      .optional()
      .default(client?.client.CLIENTNAME || ""),
    Email: z
      .string()
      .email("Invalid email address")
      .optional()
      .default(client?.client.Email || ""),
    PHONENUMBER: z
      .string()
      .optional()
      .default(client?.client.PHONENUMBER || ""),
    MAILINGADDRESS: z
      .string()
      .optional()
      .default(client?.client.MAILINGADDRESS || ""),
    MAILINGADDRESSCITYTXZIP: z
      .string()
      .optional()
      .default(client?.client.MAILINGADDRESSCITYTXZIP || ""),
    IsArchived: z
      .boolean()
      .optional()
      .default(client?.client.IsArchived || false),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      IsArchived: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Client Data :", { values });
      toast.success("Client updated successfully!");
    } catch (error) {
      toast.error("Failed to update client. Please try again.");
    }
  };

  const revertChanges = () => {
    form.reset();
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Edit Client Information
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

          <FormField
            control={form.control}
            name="MAILINGADDRESSCITYTXZIP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mailing Address (City, TX, ZIP)</FormLabel>
                <Input {...field} className="border-gray-300 rounded-lg" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="TypeOfAcct"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Input {...field} className="border-gray-300 rounded-lg" />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center gap-4">
            <Button type="submit" variant="blue" className="w-64">
              Update Client
            </Button>
            <Button
              variant="secondary"
              className="w-64"
              onClick={revertChanges}
            >
              Revert Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
