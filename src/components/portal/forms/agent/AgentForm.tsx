const AgentForm = () => {
  return (
    <div className="flex flex-col justify-center items-center border">
      <div className="w-1/2">
        <h1 className="text-2xl font-bold mb-4">Agent Form</h1>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <td>
                <header className="bg-gray-100">
                  <div className="container mx-auto">
                    <div className="flex flex-wrap items-center justify-between bg-gray-200 p-2">
                      <div className="flex-1 text-right">
                        <h4 className="text-sm font-medium">
                          Texas Comptroller of Public Accounts
                        </h4>
                      </div>
                      <div className="flex-none bg-blue-500 text-white p-2 text-center">
                        <h5 className="text-sm">Form</h5>
                        <h4 className="text-lg font-bold">50-162</h4>
                      </div>
                    </div>
                  </div>
                </header>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <section className="p-4">
                  <div className="container mx-auto">
                    <div className="space-y-4">
                      <h2 className="text-xl font-light mt-3">
                        Appointment of Agent for Property Tax Matters
                      </h2>
                      <p>
                        This form is for use by a property owner in designating
                        a lessee or other person to act as the owner's agent in
                        property tax matters. You should read all applicable law
                        and rules carefully, including Tax Code Section 1.111
                        and Comptroller Rule 9.3044. This designation will not
                        take effect until filed with the appropriate appraisal
                        district.
                      </p>
                      <p className="font-bold">
                        In some cases, you may want to contact your appraisal
                        district or other local taxing units for free
                        information and/or forms concerning your case before
                        designating an agent.
                      </p>
                    </div>

                    <form className="grid gap-4" id="frmAgent">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                            HARRIS
                          </span>
                          <label className="block mt-1 text-sm">
                            Appraisal District Name
                          </label>
                        </div>
                        <div>
                          <span className="block border border-gray-300 rounded-md p-2 bg-gray-50"></span>
                          <label className="block mt-1 text-sm">
                            Date Received <i>(appraisal district use only)</i>
                          </label>
                        </div>
                      </div>
                      {/* STEP-1 */}
                      <div className="col-span-full my-2">
                        <p className="bg-gray-200 p-2 text-sm font-medium">
                          STEP 1: Owner's Name and Address:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                              MILWEE DISTRIBUTION LLC
                            </span>
                            <label className="block mt-1 text-sm">Name</label>
                          </div>
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50"></span>
                            <label className="block mt-1 text-sm">
                              Telephone Number <i>(include area code)</i>
                            </label>
                          </div>
                          <div className="col-span-2">
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                              5003 SKIPPING STONE LN
                            </span>
                            <label className="block mt-1 text-sm">
                              Address
                            </label>
                          </div>
                          <div className="col-span-2">
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                              SUGAR LAND TX 77479-1667
                            </span>
                            <label className="block mt-1 text-sm">
                              City, State, Zip Code
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* STEP-2 */}
                      <div className="col-span-full my-4">
                        <p className="bg-gray-200 p-2 text-sm font-medium">
                          STEP 2: Identify the Property for Which Authority is
                          Granted. Identify all property for which you are
                          granting the agent authority and, unless granting
                          authority for all property listed for you, provide at
                          least one of the property identifiers listed below
                          (appraisal district account number, physical or situs
                          address, or legal description). A chief appraiser may,
                          if necessary to identify the property, request
                          additional information. In lieu of listing property
                          below, you may attach a list of all property to which
                          this appointment applies, denoting the total number of
                          additional pages attached in the lower right-hand
                          corner below.
                        </p>
                        <div className="col-span-full">
                          <p className="mb-1">(check one)</p>
                          <div className="flex items-center space-x-2 mb-1">
                            <input
                              className="form-checkbox h-5 w-5 text-blue-600"
                              type="checkbox"
                            />
                            <label>
                              all property listed for me at the above address
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <input
                              className="form-checkbox h-5 w-5 text-blue-600"
                              type="checkbox"
                              defaultChecked
                            />
                            <label>the property(ies) listed below:</label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                          <div className="flex gap-4 w-full">
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                                0590030160008
                              </span>
                              <label className="block mt-1 text-sm">
                                Appraisal District Account Number
                              </label>
                            </div>
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                                5909 MILWEE ST
                              </span>
                              <label className="block mt-1 text-sm">
                                Physical or Situs Address
                              </label>
                            </div>
                          </div>
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50 h-8"></span>
                            <label className="block mt-1 text-sm">
                              Legal Description
                            </label>
                          </div>
                          <div className="flex gap-4 w-full">
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                                0590030160009
                              </span>
                              <label className="block mt-1 text-sm">
                                Appraisal District Account Number
                              </label>
                            </div>
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                                5909 MILWEE ST
                              </span>
                              <label className="block mt-1 text-sm">
                                Physical or Situs Address
                              </label>
                            </div>
                          </div>
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50 h-8"></span>
                            <label className="block mt-1 text-sm">
                              Legal Description
                            </label>
                          </div>{" "}
                          <div className="flex gap-4 w-full">
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                                0590030160002
                              </span>
                              <label className="block mt-1 text-sm">
                                Appraisal District Account Number
                              </label>
                            </div>
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                                5909 MILWEE ST
                              </span>
                              <label className="block mt-1 text-sm">
                                Physical or Situs Address
                              </label>
                            </div>
                          </div>
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50 h-8"></span>
                            <label className="block mt-1 text-sm">
                              Legal Description
                            </label>
                          </div>
                          <div className="flex gap-4 w-full">
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50 h-8"></span>
                              <label className="block mt-1 text-sm">
                                Appraisal District Account Number
                              </label>
                            </div>
                            <div className="w-full">
                              <span className="block border border-gray-300 rounded-md p-2 bg-gray-50 h-8"></span>
                              <label className="block mt-1 text-sm">
                                Physical or Situs Address
                              </label>
                            </div>
                          </div>
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50 h-8"></span>
                            <label className="block mt-1 text-sm">
                              Legal Description
                            </label>
                          </div>
                        </div>

                        <div className="col-span-full mt-4">
                          <p className="text-sm">
                            If you have additional property for which authority
                            is granted, attach additional sheets providing the
                            appraisal district account number, physical or situs
                            address, or legal description for each property.
                            Identify here the number of additional sheets
                            attached:
                          </p>
                        </div>
                      </div>
                      <footer className="border-t-8 border-gray-400">
                        <div>
                          The Property Tax Assistance Division at the Texas
                          Comptroller of Public Accounts provides property tax
                          information and resources for taxpayers, local taxing
                          entities, appraisal districts and appraisal review
                          boards.
                        </div>
                        <div>
                          For more information, visit our website:
                          comptroller.texas.gov/taxes/property-tax
                        </div>
                      </footer>
                      {/* STEP-3 */}
                      <div className="col-span-full my-2">
                        <p className="bg-gray-200 p-2 text-sm font-medium">
                          STEP 3: Identify the Agent:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                              Lone Star Property Tax, LLC (Agent #3320467)
                            </span>
                            <label className="block mt-1 text-sm">Name</label>
                          </div>
                          <div>
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                              713-505-6806
                            </span>
                            <label className="block mt-1 text-sm">
                              Telephone Number <i>(include area code)</i>
                            </label>
                          </div>
                          <div className="col-span-2">
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                              1327 Kyle Hill Lane
                            </span>
                            <label className="block mt-1 text-sm">
                              Address
                            </label>
                          </div>
                          <div className="col-span-2">
                            <span className="block border border-gray-300 rounded-md p-2 bg-gray-50">
                              Sugar Land, TX 77479
                            </span>
                            <label className="block mt-1 text-sm">
                              City, State, Zip Code
                            </label>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </section>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentForm;
