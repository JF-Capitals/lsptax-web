import React from "react";
import { InvoiceData } from "@/types/types";

const InvoiceSummary: React.FC<{ invoice?: InvoiceData }> = ({ invoice }) => {
  const calculateFees = () => {
    if (!invoice) return 0;
    return invoice.properties.reduce((total, property) => {
      const feeString = property.invoice.ContingencyFeeDue || "$0";
      const numericValue = parseFloat(feeString.replace(/[^0-9.]/g, "")); // Remove '$' and other characters
      console.log({numericValue})
      return total + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  };
  const totalFees = calculateFees();
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      style={{
        overflow: "hidden",
      }}
    >
      {/* A4 Page Container */}
      <div
        id="pdf-content"
        className="bg-white overflow-auto shadow-lg p-4 sm:p-6 md:p-8"
        style={{
          width: "100vw",
          height: "100vh",
          aspectRatio: "210 / 297", // Maintain A4 ratio
          maxWidth: "210mm",
          maxHeight: "297mm",
          boxSizing: "border-box",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div className="text-center mb-4">
          <button
            className="border-1 border-black bg-slate-400 rounded-md p-2"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>

        <div className="flex justify-between items-start mb-4">
          <div className="flex justify-between items-start ">
            {/* <img
                 className="w-20 mr-2 border-2 border-black p-2"
                 src={Logo}
               ></img> */}
            <div>
              <h2 className="text-xl font-bold">LONE STAR PROPERTY TAX</h2>
              <p className="text-sm">16107 KENSINGTON DRIVE, STE. 194</p>
              <p className="text-sm">SUGARLAND, TX 77479</p>
              <p className="text-sm">info@lsptax.com</p>
              <p className="text-sm">713-505-6806</p>
            </div>
          </div>
          <div className="">
            <p className="font-bold">Invoice Date: {Date.now()}</p>
            <p className="font-bold">
              Invoice Number: INV-{invoice?.client.CLIENTNAME}
            </p>
          </div>
        </div>
        <div className="flex flex-col border-2 border-black p-1 mb-4 ">
          <p className="font-bold"> {invoice?.client?.CLIENTNAME} </p>
          <p>{invoice?.client?.MAILINGADDRESS}</p>
          <p>{invoice?.client?.MAILINGADDRESSCITYTXZIP}</p>
        </div>
        <div className="text-center font-bold mb-4 underline">
          FOR PROFESSIONAL SERVICES
        </div>
        {/* Additional content */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse border-2 border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Address
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Account Number
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Service
                </th>
                <th className="border border-gray-300 px-4 py-2 text-right">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice?.properties?.map((property) => (
                <tr key={property.propertyDetails.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {property.propertyDetails.MAILINGADDRESS}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {property.propertyDetails.AccountNumber}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    2024 Protest
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {property.invoice.ContingencyFeeDue}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={3}
                  className="border border-gray-300 px-4 py-2 text-right font-bold"
                >
                  Total
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  ${totalFees}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="border-t border-dashed border-gray-500 mt-4"></div>
        <div className="flex font-bold ml-20 mb-4">
          <p>Cut Here</p>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
              />
            </svg>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            {/* <p>{client?.CLIENTNAME}</p>
            <p>{client?.MAILINGADDRESS}</p>
            <p>{client?.MAILINGADDRESSCITYTXZIP}</p> */}
          </div>
          <div className="text-left border-2 border-black pr-10 bg-gray-200">
            <table>
              <thead>
                <tr>
                  <th>Account Number:</th>
                  <td>Multiple</td>
                </tr>
                <tr>
                  <th>Due Date:</th>
                  <td>Due Upon Receipt</td>
                </tr>
                <tr>
                  <th>Total Fee Due:</th>
                  <td>${totalFees}</td>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <div>
          <p className="font-bold mb-4">
            Please remit payment to adress below:
          </p>
        </div>
        <div className="flex justify-between">
          <div>
            <p>LONE STAR PROPERTY TAX</p>
            <p>16107 KENSINGTON DRIVE, STE. 194</p>
            <p>SUGARLAND, TX 77479</p>
          </div>
          <div className="text-left border-2 border-black pr-10 bg-gray-200">
            <table>
              <thead>
                <tr>
                  <th>Amount Enclosed</th>
                  <td>___________________</td>
                </tr>
                <tr>
                  <th>OR</th>
                  <th>ZELLE:</th>
                </tr>
              </thead>
            </table>
            <p>713-505-6806 (Lone Star Property Tax)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
