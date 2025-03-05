import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { ClientData, Property } from "@/types/types";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useSearchParams } from "react-router-dom";
import { getSingleClient } from "@/store/data";

interface Client {
  client: ClientData;
  properties: Property[];
}

const AppointmentForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
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
    <div>
      <Button
        variant={"blue"}
        className="bg-[#0093FF] rounded-md p-2 px-6 ml-4 text-white"
        onClick={() => reactToPrintFn()}
      >
        <Printer />
        Print
      </Button>

      <div className="w-[210mm] min-h-screen bg-white shadow-md mx-auto border border-gray-300 relative ">
        <div ref={contentRef} className=" min-h-screen bg-white mx-auto ">
          <div className="flex justify-items-end flex-row-reverse items-center bg-[#d0d4d7] ">
            <div className="flex flex-col px-12 bg-[#1c63a0] ">
              <div>Form</div>
              <div>50-162</div>
            </div>
            <div className="px-2">Texas Comptroller of Public Accounts </div>
          </div>
          <div className="">
            <h1 className="text-[#3285ca] text-[28px] mb-2">
              Appointment of Agent for Property Tax Matters
            </h1>
            <p className="text-xs mb-2">
              This form is for use by a property owner in designating a lessee
              or other person to act as the owner's agent in property tax
              matters. You should read all applicable law and rules carefully,
              including Tax Code Section 1.111 and Comptroller Rule 9.3044. This
              designation will not take effect until filed with the appropriate
              appraisal district. Once effective, this designation will be in
              effect until the earlier of (1) the date of a written revocation
              filed with the appraisal district by the owner or the owner's
              designated agent, or (2) the expiration date, if any, designated
              below
            </p>
            <p className="text-xs font-bold">
              In some cases, you may want to contact your appraisal district or
              other local taxing units for free information and/or forms
              concerning your case before designating an agent.
            </p>
          </div>
          {/* Main Form */}
          <div>
            <div className="flex justify-between ">
              <div className="flex-[2] mx-2">
                <p className="border-b border-[#3285ca]">Harris</p>
                <p className="text-xs">Appraisal District Name</p>
              </div>
              <div className="flex-[1] mx-2">
                <p className="border-b border-[#3285ca] p-3"></p>
                <p className="text-xs">
                  Date Received (appraisal district use only)
                </p>
              </div>
            </div>
            {/* Step: 1 */}
            <div>
              <div className="m-2 mt-8 px-1 text-white bg-[#3285ca]">
                <p className="text-sm">STEP 1: Owner's Name and Address:</p>
              </div>
              <div>
                <div className="flex justify-between  ">
                  <div className="flex-[2] mx-2">
                    <p className="border-b text-sm border-[#3285ca]">
                      {clientData?.client.CLIENTNAME}
                    </p>
                    <p className="text-xs">Name</p>
                  </div>
                  <div className="flex-[1] mx-2">
                    <p className="text-sm border-b border-[#3285ca] p-[10px]"></p>
                    <p className="text-xs">
                      Telephone Number (include area code)
                    </p>
                  </div>
                </div>
                <div className="m-2">
                  <p className="text-sm border-b border-[#3285ca]">
                    {clientData?.client.MAILINGADDRESS}
                  </p>
                  <p className="text-xs">Address</p>
                </div>
                <div className="m-2">
                  <p className="text-sm border-b border-[#3285ca]">
                    {" "}
                   {clientData?.client.MAILINGADDRESSCITYTXZIP}
                  </p>
                  <p className="text-xs">City, State, Zip Code</p>
                </div>
              </div>
            </div>
            {/* Step: 2 */}
            <div>
              <div className="m-2 mt-8 px-1 text-white bg-[#3285ca]">
                <p className="text-sm">
                  STEP 2: Identify the Property for Which Authority is Granted.
                  Identify all property for which you are granting the agent
                  authority and, unless granting authority for all property
                  listed for you, provide at least one of the property
                  identifiers listed below (appraisal district account number,
                  physical or situs address, or legal description). A chief
                  appraiser may, if necessary to identify the property, request
                  additional information. In lieu of listing property below, you
                  may attach a list of all property to which this appointment
                  applies, denoting the total number of additional pages
                  attached in the lower right-hand corner below.
                </p>
              </div>
              <div>
                <div className="m-2 text-xs">
                  <p>(check one)</p>
                  <div className="flex items-center my-1 ">
                    <input type="checkbox" />
                    <p className="mx-2">
                      all property listed for me at the above address
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" />
                    <p className="mx-2">the property(ies) listed below:</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between  ">
                    <div className="flex-[1] mx-2">
                      <p className="border-b text-sm border-[#3285ca]">
                        1385790010006
                      </p>
                      <p className="text-xs">
                        Appraisal District Account Number
                      </p>
                    </div>
                    <div className="flex-[2] mx-2">
                      <p className="text-sm border-b border-[#3285ca] ">
                        23518 ATWOOD LANDING LN KATY, TX 77493-3384
                      </p>
                      <p className="text-xs">
                        Physical or Situs Address of Property
                      </p>
                    </div>
                  </div>
                  <div className="m-2">
                    <p className="text-sm border-b border-[#3285ca]">.</p>
                    <p className="text-xs">Legal Description</p>
                  </div>
                  <div className="flex justify-between  ">
                    <div className="flex-[1] mx-2">
                      <p className="border-b text-sm border-[#3285ca]">.</p>
                      <p className="text-xs">
                        Appraisal District Account Number
                      </p>
                    </div>
                    <div className="flex-[2] mx-2">
                      <p className="text-sm border-b border-[#3285ca] ">.</p>
                      <p className="text-xs">
                        Physical or Situs Address of Property
                      </p>
                    </div>
                  </div>
                  <div className="m-2">
                    <p className="text-sm border-b border-[#3285ca]">.</p>
                    <p className="text-xs">Legal Description</p>
                  </div>
                  <div className="flex justify-between ">
                    <div className="flex-[1] mx-2">
                      <p className="border-b text-sm border-[#3285ca]">.</p>
                      <p className="text-xs">
                        Appraisal District Account Number
                      </p>
                    </div>
                    <div className="flex-[2] mx-2">
                      <p className="text-sm border-b border-[#3285ca] ">.</p>
                      <p className="text-xs">
                        Physical or Situs Address of Property
                      </p>
                    </div>
                  </div>
                  <div className="m-2">
                    <p className="text-sm border-b border-[#3285ca]">.</p>
                    <p className="text-xs">Legal Description</p>
                  </div>
                  <div className="flex justify-between  ">
                    <div className="flex-[1] mx-2">
                      <p className="border-b text-sm border-[#3285ca]">.</p>
                      <p className="text-xs">
                        Appraisal District Account Number
                      </p>
                    </div>
                    <div className="flex-[2] mx-2">
                      <p className="text-sm border-b border-[#3285ca] ">.</p>
                      <p className="text-xs">
                        Physical or Situs Address of Property
                      </p>
                    </div>
                  </div>
                  <div className="m-2">
                    <p className="text-sm border-b border-[#3285ca]">.</p>
                    <p className="text-xs">Legal Description</p>
                  </div>
                </div>
                <div className="m-2 mt-8 text-sm page-break">
                  <p>
                    If you have additional property for which authority is
                    granted, attach additional sheets providing the appraisal
                    district account number, physical or situs address, or legal
                    description for each property. Identify here the number of
                    additional sheets attached:
                  </p>
                </div>
              </div>
            </div>
            {/* Step: 3 */}
            <div>
              <div className="m-2 mt-8 px-1 text-white bg-[#3285ca]">
                <p className="text-sm">STEP 3: : Identify the Agent:</p>
              </div>
              <div className="flex justify-between  ">
                <div className="flex-[2] mx-2">
                  <p className="border-b text-sm border-[#3285ca]">
                    Lone Star Property Tax, LLC
                  </p>
                  <p className="text-xs">Name</p>
                </div>
                <div className="flex-[1] mx-2">
                  <p className="text-sm border-b border-[#3285ca] ">
                    713-505-6806
                  </p>
                  <p className="text-xs">
                    Telephone Number (include area code)
                  </p>
                </div>
              </div>
              <div className="m-2">
                <p className="text-sm border-b border-[#3285ca]">
                  1327 Kyle Hill Lane
                </p>
                <p className="text-xs">Address</p>
              </div>
              <div className="m-2">
                <p className="text-sm border-b border-[#3285ca]">
                  Sugar Land, TX 77479
                </p>
                <p className="text-xs">City, State, Zip Code</p>
              </div>
            </div>
            {/* Step: 4 */}
            <div>
              <div className="m-2 mt-8 px-1 text-white bg-[#3285ca]">
                <p className="text-sm">STEP 4: Specify the Agent's Authority</p>
              </div>
              <div className="m-2 text-xs">
                <p>
                  The agent identified above is authorized to represent me in
                  (check one):
                </p>
                <div className="flex items-center my-1 ">
                  <input type="checkbox" />
                  <p className="mx-2">
                    all property tax matters concerning the property identified
                  </p>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" />
                  <p className="mx-2">
                    {" "}
                    the following specific property tax matters:
                  </p>
                </div>
              </div>
              <p className="ml-8 my-4 border-b mr-2 border-[#3285ca]"></p>
              <div className="flex">
                <p className="text-xs m-2">
                  The agent identified above is authorized to receive
                  confidential information pursuant to Tax Code Sections
                  11.48(b)(2), 22.27(b)(2), 23.123(c)(2), 23.126(c)(2) and
                  23.45(b)(2):
                </p>
                <div className="flex items-center m-2">
                  <input type="checkbox" />
                  <p className="mx-1">Yes</p>
                  <input type="checkbox" />
                  <p className="mx-1">No</p>
                </div>
              </div>
              <p className="text-xs m-2">
                I hereby direct, as indicated below, the appraisal district,
                appraisal review board, and each taxing unit participating in
                the appraisal district to deliver the documents checked below to
                the agent identified above regarding the property identified. I
                acknowledge that such documents will be delivered only to the
                agent at the agent's address indicated above and will not be
                delivered to me unless the affected offices choose to send me
                copies or are otherwise required by law. I understand that these
                documents can affect my legal rights and that the appraisal
                district, appraisal review board and the taxing units are not
                required to send me copies if I direct them to deliver the
                documents to my agent.
              </p>
              <div className="m-2 text-xs">
                <div className="flex items-center my-1 ">
                  <input type="checkbox" />
                  <p className="mx-2">
                    {" "}
                    all communications from the chief appraiser
                  </p>
                </div>
                <div className="flex items-center my-1 ">
                  <input type="checkbox" />
                  <p className="mx-2">
                    {" "}
                    all communications from the appraisal review board
                  </p>
                </div>
                <div className="flex items-center my-1 ">
                  <input type="checkbox" />
                  <p className="mx-2">
                    {" "}
                    all communications from all taxing units participating in
                    the appraisal district
                  </p>
                </div>
              </div>
            </div>
            {/* Step: 5 */}
            <div>
              <div className="m-2 mt-8 px-1 text-white bg-[#3285ca]">
                <p className="text-sm">
                  STEP 5: Date the Agent's Authority Ends. Pursuant to Tax Code
                  Section 1.111(c), this designation remains in effect until the
                  date indicated or until a written revocation is filed with the
                  appraisal district by the property owner or the owner's
                  designated agent. A designation may be made to expire
                  according to its own terms but is still subject to prior
                  revocation by the property owner or designated agent. Pursuant
                  to Tax Code Section 1.111(d), a property owner may not
                  designate more than one agent to represent the property owner
                  in connection with an item of property. The designation of an
                  agent in connection with an item of property revokes any
                  previous designation of an agent in connection with that item
                  of property. By designating an agent on this form, previous
                  designations of other agents in connection with the items of
                  property shown on the form are revoked.
                </p>
              </div>
              <div className="flex items-center m-2 my-4">
                <p className="flex-[1] text-xs">
                  Date Agent's Authority Ends . . .{" "}
                </p>
                <p className="flex-[2] text-xs border-b mr-2 border-[#3285ca]">
                  .
                </p>
              </div>
            </div>
            {/* Step: 6 */}
            <div className="m-2 mt-8 page-break">
              <div className=" px-1 text-white bg-[#3285ca]">
                <p className="text-sm">
                  STEP 6: Identification, Signature, and Date:
                </p>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex font-bold text-lg flex-[1]">
                  sign <br /> Here <p> &#129034;</p>
                </div>
                <div className="mt-4 mr-4">
                  <p className="flex-[8] text-xs border-b border-[#3285ca]">
                    .
                  </p>
                  <p className="text-xs">
                    Signature of Property Owner, Property Manager or Other
                    Person
                  </p>
                  <p className="text-xs">
                    Authorized to Act on Behalf of the Property Owner*
                  </p>
                </div>
                <div className="flex-[2]">
                  <p className=" text-xs border-b border-[#3285ca]">.</p>
                  <p className="text-xs">Date</p>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex font-bold text-lg flex-[1]">
                  print <br /> Here <p> &#129034;</p>
                </div>
                <div className="mt-4 mr-4">
                  <p className="flex-[8] text-xs border-b border-[#3285ca]">
                    .
                  </p>
                  <p className="text-xs">
                    Printed Name of Property Owner, Property Manager or Other
                    Person
                  </p>
                  <p className="text-xs">
                    Authorized to Act on Behalf of the Property Owner
                  </p>
                </div>
                <div className="flex-[2]">
                  <p className=" text-xs border-b border-[#3285ca]">.</p>
                  <p className="text-xs">Title</p>
                </div>
              </div>
              <div className="my-4">
                <div className="m-2 text-xs">
                  <p className="font-bold">
                    The individual signing this form is (check one):
                  </p>
                  <div className="flex items-center my-1 ">
                    <input type="checkbox" />
                    <p className="mx-2">the property owner</p>
                  </div>
                  <div className="flex items-center my-1 ">
                    <input type="checkbox" />
                    <p className="mx-2">
                      {" "}
                      a property manager authorized to designate agents for the
                      owner
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" />
                    <p className="mx-2">
                      {" "}
                      other person authorized to act on behalf of the owner
                      other than the person being designated as agent
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs">
                * This form must be signed by the property owner, a property
                manager authorized to designate agents for the owner or other
                person authorized to act on behalf of the owner other than the
                person being designated as agent. If you are a person other than
                the property owner, the appraisal district may request a copy of
                the document(s) authorizing you to designate agents or act on
                behalf of the property owner.
              </p>
              <p className="font-bold text-xs mt-2">
                If you make a false statement on this form, you could be found
                guilty of a Class A misdemeanor or a state jail felony under
                Penal Code Section 37.10.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
