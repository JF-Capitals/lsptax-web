const ContractForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-2">
      <div className="flex flex-col items-center justify-center p-8 bg-white md:w-[780px] ">
        <div className="w-full">
          <h1 className="text-2xl text-center">ContractForm</h1>
          <div>
            <p>
              <h1 className="text-2xl my-4">Terms and Conditions</h1>
              <p>
                By signing this form, I warrant and represent that I am the
                owner on record of the below property(s) or that I am legally
                authorized and empowered to enter into this agreement on behalf
                of the owner on record of the above property(s). <br />I agree
                to pay Lone Star Property Tax, LLC (LSPT) a contingency fee
                equal to of the projected tax savings (as defined below)
                achieved by the agent for each protested tax year on the below
                property(s). Projected savings are defined and calculated as the
                difference between Initial Appraised Value and the Final
                Appraised Value multiplied by the latest known tax rate. I
                understand that there will be no charge if LSPT does not achieve
                a reduction in the appraised value of the above property(s).{" "}
                <br /> The contingency fee is calculated without regard to
                exemption amounts offered by individual taxing jurisdictions. If
                LSPT has records demonstrating you have an over 65 exemption,
                the contingency fee for that property will be reduced to 25%.{" "}
                <br /> I understand that the contingency fee will be invoiced
                upon completion of the property tax hearing and is due within 30
                days of receipt. After 30 days, the invoice is considered
                delinquent, and any unpaid balance is subject to collection
                costs.
              </p>
            </p>
            <p>
              <h1 className="text-2xl my-4">Authorizations</h1>
              <p>
                I authorize LSPT to file notice of protest with the appropriate
                County Appraisal District and to negotiate and present cases on
                my behalf. The representation is to occur year after year until
                notice is given otherwise by either party. <br /> I authorize
                LSPT to use their sole discretion in determining whether
                pursuing a tax reduction is feasible. I understand that LSPT
                does not guarantee any specific outcome or result. I authorize
                LSPT to accept settlement offers or withdraw protests if they
                determine it to be in my best interest. LSPT can seek refunds
                from overpayment from previous years if deemed appropriate by
                them, and I agree to pay LSPT of 25% tax refunds obtained.
              </p>
            </p>
            <p>
              <h1 className="text-2xl my-4">Liabilities</h1>
              <p>
                LSPT's liability for any error, omission, action, inaction, or
                representation is limited to the amount of fees actually paid
                under this contract for the year or years in dispute. All
                parties agree that any action arising from this agreement shall
                be brought in Harris County.
              </p>
            </p>
            <p>
              <h1 className="text-2xl my-4">Length of Agreement</h1>
              <p>
                This agreement can be cancelled without notice at any time if
                requested information is not provided timely prior to the
                hearing taking place or if payment becomes delinquent. This
                agreement auto-renews every year until property is sold or the
                property owner sends termination notice via email to
                info@lsptax.com
              </p>
            </p>
            <div className="flex flex-col gap-4 my-4">
              <div className="flex gap-4 justify-center">
                <div className="flex flex-col w-full">
                  <span className="border-black border-b-2">placeholder</span>
                  <label>Signature Of Owner/Respresentative</label>
                </div>
                <div className="flex flex-col w-full">
                  <span className="border-black border-b-2">Mohammed Ali</span>
                  <label className="font-bold">
                    Owner/Representative (Please Print)
                  </label>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <div className="flex flex-col w-full">
                  <span className="border-black border-b-2">
                    (832) 250-7326
                  </span>
                  <label>Phone Number</label>
                </div>
                <div className="flex flex-col w-full">
                  <span className="border-black border-b-2">
                    purchasingqt@gmail.com
                  </span>
                  <label className="font-bold">Email Address</label>
                </div>
              </div>{" "}
              <div className="flex gap-4 justify-center">
                <div className="flex flex-col w-full">
                  <span className="border-black border-b-2">
                    13130 Hampstead Road Houston TX 77040
                  </span>
                  <label>Mailing Address</label>
                </div>
                <div className="flex flex-col w-full">
                  <span className="border-black border-b-2">12/23/2022</span>
                  <label className="font-bold">Date</label>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-4xl font-extrabold text-center">Addendum</h1>
              <p>
                Below is the list of properties that you authorize LSPT to
                represent:
              </p>
              <table className="border-2 border-black border-collapse w-full my-4">
                <thead>
                  <tr>
                    <th className="border-2 border-black p-1 text-left">
                      Property Address
                    </th>
                    <th className="border-2 border-black p-1 text-left">
                      County
                    </th>
                    <th className="border-2 border-black p-1 text-left">
                      Account Number
                    </th>
                    <th className="border-2 border-black p-1 text-left">
                      %/Fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-2 border-black p-1 text-left">
                      5909 MILWEE ST HOUSTON TX 77092
                    </td>
                    <td className="border-2 border-black p-1 text-left">
                      HARRIS
                    </td>
                    <td className="border-2 border-black p-1 text-left">
                      0590030160008
                    </td>
                    <td className="border-2 border-black p-1 text-left">25%</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex gap-2">
                <div className="w-full flex ">
                  <h1 className="mr-2">Initial:</h1>
                  <span className="flex-grow border-b-2 border-black"></span>
                </div>
                <div className="w-full flex">
                  <h1 className="mr-2">Date:</h1>
                  <span className="flex-grow border-b-2 border-black"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractForm;
