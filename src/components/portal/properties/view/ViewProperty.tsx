import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import {
  getSingleProperty,
} from "@/store/data";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/types";

const ViewProperty = () => {
  const [property, setProperty] = useState<PropertyData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProperty = async () => {
      const propertyId = searchParams.get("propertyId");
      console.log({ propertyId });
      if (!propertyId) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }

      try {
        const propertyData = await getSingleProperty({ propertyId });
        setProperty(propertyData);
        setLoading(false)
        console.log({propertyData})
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    console.log({ property });
  }, [searchParams]); // Trigger when searchParams changes

  const groups = [
    {
      title: "General Info",
      fields: [
        // { label: "ID", value: property?.invoiceDetails.id },
        {
          label: "Account Number",
          value: property?.propertyDetails.AccountNumber,
        },
        {
          label: "CLIENT Number",
          value: property?.propertyDetails.CLIENTNumber,
        },
        // { label: "Type of Service", value: property?. },
        // { label: "Total Due", value: property?.TotalDue },
        {
          label: "Archived",
          value: property?.propertyDetails.IsArchived ? "Yes" : "No",
        },
      ],
    },
    {
      title: "BPP Details",
      fields: [
        { label: "BPP Invoice", value: property?.invoices.BPPInvoice },
        {
          label: "BPP Invoice Paid",
          value: property?.invoices.BPPInvoicePaid,
        },
        {
          label: "BPP This Year Appraised",
          value: property?.invoices.BPPThisYearAppraised,
        },
        {
          label: "Last Year Appraised",
          value: property?.invoices.TaxBPPBPPLastYearAppraised,
        },
        {
          label: "Final Appraised Total",
          value: property?.invoices.TaxBPPFinalAppraisedTotal,
        },
        {
          label: "Appraised Value Reduction",
          value: property?.invoices.TaxBPPAppraisedValueReduction,
        },
        {
          label: "Overall Tax Rate",
          value: property?.invoices.TaxBPPOverallTaxRate,
        },
        {
          label: "Tax Savings",
          value: property?.invoices.TaxBPPTaxSavings,
        },
        {
          label: "Contingency Fee",
          value: property?.invoices.TaxBPPContingencyFee,
        },
        { label: "Tax Due", value: property?.invoices.TaxBPPDue },
      ],
    },
    {
      title: "Arbitration Details",
      fields: [
        {
          label: "Final Appraised Total",
          value: property?.invoices.ArbitrationFinalAppraisedTotal,
        },
        {
          label: "Appraised Value Reduction",
          value: property?.invoices.ArbitrationAppraisedValueReduction,
        },
        {
          label: "Overall Tax Rate",
          value: property?.invoices.ArbitrationOverallTaxRate,
        },
        { label: "Tax Savings", value: property?.invoices.TaxSavings },
        {
          label: "Contingency Fee",
          value: property?.invoices.ArbitrationContingencyFee,
        },
        { label: "Due", value: property?.invoices.ArbitrationDue },
      ],
    },
    {
      title: "2525 Details",
      fields: [
        {
          label: "Final Appraised Total",
          value: property?.invoices.Value2525FinalAppraisedTotal,
        },
        {
          label: "Appraised Value Reduction",
          value: property?.invoices.Value2525AppraisedValueReduction,
        },
        {
          label: "Overall Tax Rate",
          value: property?.invoices.Value2525OverallTaxRate,
        },
        {
          label: "Tax Savings",
          value: property?.invoices.Value2525TaxSavings,
        },
        {
          label: "Contingency Fee",
          value: property?.invoices.Value2525ContingencyFee,
        },
        { label: "Due", value: property?.invoices.Value2525Due },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  if (!property) {
    console.log({property})
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold text-gray-700">
          No property details to display
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between ">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 ">
          View Property
        </h1>
        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
          <NavLink
            to={`/portal/edit-properties?propertyId=${property.propertyDetails.AccountNumber}`}
          >
            <Button className="w-full">Edit Property</Button>
          </NavLink>

          <NavLink
            to={`/portal/invoices?propertyId=${property.propertyDetails.AccountNumber}`}
          >
            <Button className="w-full">View Invoices</Button>
          </NavLink>

          <NavLink to={"/editProperty"}>
            <Button className="w-full">Schedule Hearing Date</Button>
          </NavLink>
        </div>
      </div>

      <div className="flex flex-col md:flex-row align-center items-center justify-between items-center border rounded-xl bg-gray-100 my-2 p-4">
        <h1 className="text-4xl font-bold text-center">
          Lone Star Property Tax
        </h1>
        <div className="text-lg">
          <h1 className="flex gap-2">
            Property No:
            <p className="font-bold">
              #{property.propertyDetails.AccountNumber}
            </p>
          </h1>
          <h2 className="flex gap-2">
            Client No:
            <p className="font-bold">
              #{property.propertyDetails.CLIENTNumber}
            </p>
          </h2>
        </div>
      </div>

      <div className="gap-2 flex flex-col md:flex-row justify-between ">
        {/* Client Details Table */}
        <div className="border rounded-xl p-4 w-full">
          <h2 className="font-semibold text-lg mb-2">Client Details</h2>
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Client:</td>
                <td>{property.clientDetails?.CLIENTNAME}</td>
              </tr>
              <tr>
                <td className="font-medium">Phone:</td>
                <td>
                  <Phone size={18} className="inline text-indigo-600 mr-2" />
                  {property.clientDetails?.PHONENUMBER}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Email:</td>
                <td>
                  <Mail size={18} className="inline text-indigo-600 mr-2" />
                  {property.clientDetails?.Email}
                </td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  <MapPin size={18} className="inline text-indigo-600 mr-2" />
                  {property?.propertyDetails.MAILINGADDRESS},{" "}
                  {property?.propertyDetails.MAILINGADDRESSCITYTXZIP}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Property Details Table */}
        <div className="border rounded-xl p-4 w-full">
          <h2 className="font-semibold text-lg mb-2">Property Details</h2>
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-medium">Assessor:</td>
                <td>{property.propertyDetails.CONTACTOWNER}</td>
              </tr>
              <tr>
                <td className="font-medium">Address:</td>
                <td>
                  {property.propertyDetails.CADMailingADDRESS + " "}
                  {property.propertyDetails.CADZIPCODE + " "}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border rounded-lg my-2 p-4">
        <h2 className="text-2xl font-bold mb-6">Invoice Details</h2>
        {property.invoices ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
                <ul className="space-y-2">
                  {group.fields.map(
                    (field, idx) =>
                      field.value && (
                        <li key={idx} className="text-sm">
                          <strong>{field.label}:</strong> {field.value}
                        </li>
                      )
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No invoice data available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewProperty;
