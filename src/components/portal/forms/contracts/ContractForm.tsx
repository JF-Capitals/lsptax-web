import { getSingleClient } from "@/store/data";
import { ClientData, Property } from "@/types/types";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface Client {
  client: ClientData;
  properties: Property[];
}
export default function ContractForm() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");

  // const [invoiceData, setInvoiceData] = useState<InvoiceData>();
  const [clientData, setClientData] = useState<Client>();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (clientId) {
          const response = await getSingleClient({ clientId: clientId });
          setClientData(response);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  return (
    <div className="w-[210mm] min-h-screen bg-white p-8 shadow-md mx-auto border border-gray-300 relative">
      <div>
        <div className="text-center my-4">
          <p className="font-bold text-md underline">
            PROPERTY REPRESENTATION AGREEMENT
          </p>
        </div>

        <div className="my-4 ">
          <p className="font-bold text-sm">Terms and Condions</p>
          <div className="text-xs mt-2">
            <p className="mt-2">
              By signing this form, I warrant and represent that I am the owner
              on record of the below property(s) or that I am legally authorized
              and empowered to enter into this agreement on behalf of the owner
              on record of the above property(s).
            </p>
            <p className="mt-2">
              I agree to pay Lone Star Property Tax, LLC (LSPT) a conngency fee
              equal to 35% of the projected tax savings (as dened below)
              achieved by the agent for each protested tax year on the below
              property(s). Projected savings are dened and calculated as the
              dierence between Inial Appraised Value and the Final Appraised
              Value mulplied by the latest known tax rate. I understand that
              there will be no charge if LSPT does not achieve a reducon in the
              appraised value of the above property(s).
            </p>
            <p className="mt-2">
              The conngency fee is calculated without regard to exempon amounts
              oered by individual taxing jurisdicons. If LSPT has records
              demonstrang you have an over 65 exempon, the conngency fee for
              that property will be reduced to 25%.
            </p>
            <p className="mt-2">
              I understand that the conngency fee will be invoiced upon compleon
              of the property tax hearing and is due within 30 days of receipt.
              Aer 30 days, the invoice is considered delinquent, and any unpaid
              balance is subject to collecon costs.
            </p>
          </div>
          <div>
            <p className="font-bold text-sm mt-4">Authorizaons</p>
            <div className="text-xs mt-2">
              <p className="mt-2">
                I authorize LSPT to file notice of protest with the appropriate
                County Appraisal District and to negotiate and present cases on
                my behalf. The representation is to occur year after year until
                notice is given otherwise by either party.
              </p>
              <p className="mt-2">
                I authorize LSPT to use their sole discreon in determining
                whether pursuing a tax reducon is feasible. I understand that
                LSPT does not guarantee any specic outcome or result. I
                authorize LSPT to acceptselement oers or withdraw protests if
                they determine it to be in my best interest. LSPT can seek
                refunds from overpayment from previous years if deemed
                appropriate by them, and I agree to pay LSPT of 35% tax refunds
                obtained.
              </p>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm mt-4">Liabilies</p>
            <div className="text-xs mt-2">
              <p className="mt-2">
                LSPT's liability for any error, omission, acon, inacon, or
                representaon is limited to the amount of fees actually paid
                under this contract for the year or years in dispute. All pares
                agree that any acon arising from this agreement shall be brought
                in Harris County
              </p>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm mt-4">Length of Agreement</p>
            <div className="text-xs mt-2">
              <p className="mt-2">
                This agreement can be cancelled without noce at any me if
                requested informaon is not provided mely prior to the hearing
                taking place or if payment becomes delinquent. This agreement
                auto-renews every year unl property is sold or the property
                owner sends terminaon noce via email to info@lsptax.com
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <div className="flex-1 mr-2">
              <p className=" text-xs border-b-2 mr-2 border-black">.</p>
              <p className="text-sm">Signature of Owner/Representave</p>
            </div>
            <div className="flex-1 ml-2">
              <p className="text-xs border-b-2 mr-2 border-black">
                {clientData?.client.CLIENTNAME}
              </p>
              <p className="text-sm">Owner/Representave (Please Print)</p>
            </div>
          </div>
          <div className="flex justify-between my-4">
            <div className="flex-1 mr-2">
              <p className=" text-xs border-b-2 mr-2 border-black">
                {clientData?.client.PHONENUMBER}
              </p>
              <p className="text-sm">Phone Number</p>
            </div>
            <div className="flex-1 ml-2">
              <p className="text-xs border-b-2 mr-2 border-black">
                {clientData?.client.Email}
              </p>
              <p className="text-sm">Email Address</p>
            </div>
          </div>
          <div className="flex justify-between my-4">
            <div className="flex-1 mr-2">
              <p className=" text-xs border-b-2 mr-2 border-black">
                {clientData?.client.MAILINGADDRESS},
                {clientData?.client.MAILINGADDRESSCITYTXZIP}
              </p>
              <p className="text-sm">Mailing Address</p>
            </div>
            <div className="flex-1 ml-2">
              <p className="text-xs border-b-2 mr-2 border-black">
                {Date.now()}
              </p>
              <p className="text-sm">Date</p>
            </div>
          </div>
        </div>
        <div>
          <p className="font-bold underline text-center my-4">Addendum</p>
          <p className="text-xs">
            Below is the list of properes that you authorize LSPT to represent:
          </p>
          <table className="w-full border-collapse border border-black print:border">
            <thead>
              <tr className="bg-gray-200 print:bg-gray-100">
                <th className="border border-black p-2 print:p-1 text-left print:text-xs">
                  Property Address{" "}
                </th>
                <th className="border border-black p-2 print:p-1 text-left print:text-xs">
                  County
                </th>
                <th className="border border-black p-2 print:p-1 text-left print:text-xs">
                  Account Number
                </th>
                <th className="border border-black p-2 print:p-1 text-left print:text-xs">
                  % / fee
                </th>
              </tr>
            </thead>
            <tbody>
              {clientData?.properties.map((property, index) => (
                <tr key={index}>
                  <td className="border border-black p-2 print:p-1 print:text-xs">
                    {property.MAILINGADDRESS}
                  </td>
                  <td className="border border-black p-2 print:p-1 print:text-xs">
                    {property.CADCOUNTY}
                  </td>
                  <td className="border border-black p-2 print:p-1 print:text-xs">
                    {property.AccountNumber}
                  </td>
                  <td className="border border-black p-2 print:p-1 print:text-xs">
                    {property.CONTINGENCYFee}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('./assets/logo.png')] bg-repeat-y bg-center" />
    </div>
  );
}
