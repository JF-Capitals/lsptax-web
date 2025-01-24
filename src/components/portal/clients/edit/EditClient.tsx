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
  console.log(clientId); // Check if the ID is correct
  useEffect(() => {
    async function loadClientData() {
      try {
        if (clientId) {
          const data = await getSingleClient({ clientId });
          setClient(data);
          console.log({ data });
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
      .default(client?.client.TypeOfAcct || ""),
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
      // Call the API or function to update the property
      // await updateProperty({ propertyId, data: values });
      console.log("PROPERTY FORM DATA :", { values });
      toast.success("Property updated successfully!");
    } catch (error) {
      toast.error("Failed to update property. Please try again.");
    }
  };

  const revertChanges = () => {
    // form.reset(client); // Reset form to the fetched property data
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 m-3 py-10 px-6 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          Edit Client Information
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <FormField
              control={form.control}
              name="CLIENTNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Number</FormLabel>
                  <Input
                    placeholder={client?.client.CLIENTNumber}
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
              name="CLIENTNAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <Input
                    placeholder={client?.client.CLIENTNAME}
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
                    placeholder={client?.client.Email}
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
              name="PHONENUMBER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    placeholder={client?.client.PHONENUMBER}
                    {...field}
                    className="border-gray-300"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
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
          Update Client
        </Button>

        <Button variant="blue" className="mt-6 w-64" onClick={revertChanges}>
          Revert Changes
        </Button>
      </form>
    </Form>
  );
}
