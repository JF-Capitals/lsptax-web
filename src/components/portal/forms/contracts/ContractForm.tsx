import { getSingleClient } from "@/store/data";
import { ClientData, Property } from "@/types/types";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
// import Logo from "@/assets/logo.svg";
// import AppointmentForm from "./AppointmentForm";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <>
      <Button
        variant={"blue"}
        className="bg-[#0093FF] rounded-md p-2 px-6 ml-4 text-white"
        onClick={() => reactToPrintFn()}
      >
        <Printer />
        Print
      </Button>
      <div className="w-[210mm] min-h-screen bg-white shadow-md mx-auto border border-gray-300 relative ">
        <div ref={contentRef} className="p-8">
          <div className="">
            <div className="text-center my-4">
              <p className="font-bold text-md underline">
                PROPERTY REPRESENTATION AGREEMENT
              </p>
            </div>

            <div className="my-4 ">
              <p className="font-bold text-sm">Terms and Conditions</p>
              <div className="text-xs mt-2">
                <p className="mt-2">
                  By signing this form, I warrant and represent that I am the
                  owner on record of the below property(s) or that I am legally
                  authorized and empowered to enter into this agreement on
                  behalf of the owner on record of the above property(s).
                </p>
                <p className="mt-2">
                  I agree to pay Lone Star Property Tax, LLC (LSPT) a
                  contingency fee equal to{" "}
                  {clientData?.properties[0].CONTINGENCYFee} of the projected
                  tax savings (as dened below) achieved by the agent for each
                  protested tax year on the below property(s). Projected savings
                  are defined and calculated as the difference between Initial
                  Appraised Value and the Final Appraised Value multiplied by
                  the latest known tax rate. I understand that there will be no
                  charge if LSPT does not achieve a reduction in the appraised
                  value of the above property(s).
                </p>
                <p className="mt-2">
                  The contingency fee is calculated without regard to exemption
                  amounts oered by individual taxing jurisdictions. If LSPT has
                  records demonstrating you have an over 65 exemption, the
                  contingency fee for that property will be reduced to{" "}
                  {clientData?.properties[0].CONTINGENCYFee}
                </p>
                <p className="mt-2">
                  I understand that the contingency fee will be invoiced upon
                  completion of the property tax hearing and is due within 30
                  days of receipt. After 30 days, the invoice is considered
                  delinquent, and any unpaid balance is subject to collection
                  costs.
                </p>
              </div>
              <div>
                <p className="font-bold text-sm mt-4">Authorizations</p>
                <div className="text-xs mt-2">
                  <p className="mt-2">
                    I authorize LSPT to file notice of protest with the
                    appropriate County Appraisal District and to negotiate and
                    present cases on my behalf. The representation is to occur
                    year aer year until notice is given otherwise by either
                    party.
                  </p>
                  <p className="mt-2">
                    I authorize LSPT to use their sole discretion in determining
                    whether pursuing a tax reducon is feasible. I understand
                    that LSPT does not guarantee any specific outcome or result.
                    I authorize LSPT to accept settlement oders or withdraw
                    protests if they determine it to be in my best interest.
                    LSPT can seek refunds from overpayment from previous years
                    if deemed appropriate by them, and I agree to pay LSPT of{" "}
                    {clientData?.properties[0].CONTINGENCYFee} tax refunds
                    obtained.
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold text-sm mt-4">Liabilities</p>
                <div className="text-xs mt-2">
                  <p className="mt-2">
                    LSPT's liability for any error, omission, action, inaction,
                    or representation is limited to the amount of fees actually
                    paid under this contract for the year or years in dispute.
                    All parties agree that any action arising from this
                    agreement shall be brought in Harris County.
                  </p>
                </div>
              </div>
              <div>
                <p className="font-bold text-sm mt-4">Length of Agreement</p>
                <div className="text-xs mt-2">
                  <p className="mt-2">
                    This agreement can be cancelled without notice at any me if
                    requested information is not provided timely prior to the
                    hearing taking place or if payment becomes delinquent. This
                    agreement auto-renews every year until property is sold or
                    the property owner sends termination notice via email to
                    info@lsptax.com
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <div className="flex-1 mr-2">
                  <p className=" text-xs border-b-2 p-2 mr-2 border-black"></p>
                  <p className="text-sm">Signature of Owner/Representative</p>
                </div>
                <div className="flex-1 ml-2">
                  <p className="text-xs border-b-2 mr-2 border-black">
                    {clientData?.client.CLIENTNAME}
                  </p>
                  <p className="text-sm">Owner/Representative (Please Print)</p>
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
                  <p className="text-xs border-b-2 mr-2 p-2 border-black">{}</p>
                  <p className="text-sm">Date</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-bold underline text-center my-4 mt-12 page-break">
                Addendum
              </p>
              <p className="text-xs">
                Below is the list of properties that you authorize LSPT to
                represent:
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
          {/* <div
            className="absolute inset-0 opacity-10 pointer-events-none  bg-repeat-y bg-center bg-contain"
            style={{ backgroundImage: `url(${Logo})` }}
          /> */}
          {/* Appointment Page */}
          {/* <div className="mt-16 page-break">
            <AppointmentForm></AppointmentForm>
          </div> */}
        </div>
      </div>
    </>
  );
}
