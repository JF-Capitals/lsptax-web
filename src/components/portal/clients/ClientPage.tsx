import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSingleClient } from "@/store/data";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

// Type definition for Client based on your Prisma schema
interface Client {
  ls_client_id: number;
  ls_client_number: string;
  ls_client_is_prospect: number;
  ls_client_co_id?: number;
  ls_client_subco_id?: number;
  ls_client_salutation?: string;
  ls_client_fname?: string;
  ls_client_lname?: string;
  ls_client_name?: string;
  ls_client_email?: string;
  ls_client_phone?: string;
  ls_client_mobile?: string;
  ls_client_fax?: string;
  ls_client_job_title?: string;
  ls_client_dob?: string;
  ls_client_street?: string;
  ls_client_city?: string;
  ls_client_state?: string;
  ls_client_zip?: string;
  ls_client_country: string;
  contract_type?: string;
  ls_client_fixed_fee?: string;
  ls_client_cont_fee?: string;
  ls_client_bpp_fixed_fee?: string;
  ls_client_notes?: string;
  ls_client_status: number;
  ls_client_added_on: string;
  ls_client_added_by?: number;
  ls_client_updated_on?: string;
  ls_client_updated_by?: number;
}

const ClientPage = () => {
  const [searchParams] = useSearchParams();
  const clientId = Number(searchParams.get("clientId"));
  const [clientData, setClientData] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await getSingleClient({ clientId: clientId });
        setClientData(response);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  // const renderData = (data: string | null | undefined) => {
  //   return data ? data : "N/A";
  // };

  if (!clientData) {
    return (
      <div className="text-center text-gray-500">Loading client data...</div>
    );
  }

  return (
    <div className="m-2 rounded-lg bg-white p-4">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold text-center mb-6">Client Details</h1>
        <div className="flex gap-4">
          <NavLink to={``}>
            <Button variant={"blue"} className="w-full">
              Edit Client Details
            </Button>
          </NavLink>
          <NavLink to={"/add-properties"}>
            <Button variant={"blue"} className="w-full">
              Add Properties
            </Button>
          </NavLink>
        </div>
      </div>

      <div className="gap-2 flex flex-col md:flex-row justify-between">
        {/* Client Details Table */}
        <div className=" rounded-xl p-4 w-full">
          {/* <h2 className="font-semibold text-lg mb-2">Client Details</h2> */}
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Client:</td>
                <td>
                  {clientData.ls_client_fname +
                    " " +
                    clientData.ls_client_lname}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.ls_client_mobile || clientData.ls_client_phone}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.ls_client_email}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {clientData.ls_client_street + " "}
                  {clientData.ls_client_city + " "}
                  {clientData.ls_client_state + " "}
                  {clientData.ls_client_zip + " "}
                  {clientData.ls_client_country}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold  mb-6">Associated Property(s)</h1>
        <div></div>
      </div>
    </div>
  );
};

export default ClientPage;
